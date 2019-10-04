process.env.TZ = 'UTC';
const { expect } = require('chai');
const knex = require('knex');
const app = require('../src/app');
const { makeBookmarkArray } = require('./bookmark.fixtures');

describe('Bookmark endpoints', function(){
    let db;

    before('make knex instance', () => {
        db = knex({
            client: 'pg',
            connection: process.env.TEST_DB_URL
        })
        app.set('db', db)
    })

    after('disconnect from db', () => db.destroy())

    before('clean the table', () => db('bookmark_reviews').truncate())

    afterEach('cleanup', () => db('bookmark_reviews').truncate())

    describe('GET /bookmarks', () => {
        context('Given no articles', () => {
            it('responds with 200 and an empty list', () => {
                return supertest(app)
                    .get('/bookmarks')
                    .expect(200, [])
            })
        })
    })

    describe('GET /bookmarks/:id', () => {
        context('Given no bookmarks', () => {
            it('responds with 404', () => {
                const bookmarkId = 123456
                return supertest(app)
                    .get(`/bookmarks/${bookmarkId}`)
                    .expect(404, {error: {message: `Bookmark doesnt exist`}})
            })
        })

        context('Given there are bookmarks in the database', () => {
            const bookmarks = makeBookmarkArray();
    
            beforeEach('insert bookmarks', () => {
                return db
                  .into('bookmark_reviews')
                  .insert(bookmarks)
              })
        
              it('responds with 200 and the specified bookmark', () => {
                const bookmarkId = 2
                const expectedBookmark = bookmarks[bookmarkId - 1]
                return supertest(app)
                  .get(`/bookmarks/${bookmarkId}`)
                  .expect(200, expectedBookmark)
              })
        })
    })

    context(`Given an XSS attack bookmark`, () => {
        const maliciousArticle = {
        id: 911,
        bookmark_name: 'Naughty naughty very naughty <script>alert("xss");</script>',
        bookmark_desc: 'How-to',
        bookmark_website: `Bad image <img src="https://url.to.file.which/does-not.exist" onerror="alert(document.cookie);">. But not <strong>all</strong> bad.`,
        bookmark_rating: 2
        }

        beforeEach('insert malicious article', () => {
        return db
            .into('bookmark_reviews')
            .insert([ maliciousArticle ])
        })

        it('removes XSS attack content', () => {
        return supertest(app)
            .get(`/bookmarks`)
            .expect(200)
            .expect(res => {
            expect(res.body[0].bookmark_name).to.eql('Naughty naughty very naughty &lt;script&gt;alert(\"xss\");&lt;/script&gt;')
            expect(res.body[0].bookmark_website).to.eql(`Bad image <img src="https://url.to.file.which/does-not.exist">. But not <strong>all</strong> bad.`)
            })
        })
    })

    describe('POST /bookmarks', () => {
        it('creates bookmark, responding with 201 and the new bookmark', function (){
            this.retries(3)
            const newBookmark = {
                bookmark_name: 'Lion King',
                bookmark_desc: 'Boring plot',
                bookmark_website: 'https://www.google.com',
                bookmark_rating: 3,
            }
            return supertest(app)
                .post('/bookmarks')
                .send(newBookmark)
                .expect(201)
                .expect(res => {
                    expect(res.body.bookmark_name).to.eql(newBookmark.bookmark_name)
                    expect(res.body.bookmark_desc).to.eql(newBookmark.bookmark_desc)
                    expect(res.body.bookmark_website).to.eql(newBookmark.bookmark_website)
                    expect(res.body.bookmark_rating).to.eql(newBookmark.bookmark_rating)
                    expect(res.body).to.have.property('id')
                    expect(res.headers.location).to.eql(`/bookmarks/${res.body.id}`)
                })
                .then(res => 
                    supertest(app)
                        .get(`/bookmarks/${res.body.id}`)
                        .expect(res.body)
                )
        })

        const requiredFields = ['bookmark_name', 'bookmark_website', 'bookmark_rating']

        requiredFields.forEach(field => {
            const newBookmark = {
                bookmark_name: 'Lion King',
                bookmark_desc: 'boring plot',
                bookmark_website: 'https://www.google.com',
                bookmark_rating: 4
            }

        it(`responds with a 400 and an error message when the ${field} is missing`,() => {
            delete newBookmark[field]

            return supertest(app)
                .post('/bookmarks')
                .send(newBookmark)
                .expect(400, {
                    error: {message: `Missing '${field}' in request body`}
                })
            })
        })
    })

    describe(`DELETE /bookmarks/:id`, () => {
        context('Given there are bookmarks in the database', () => {
            const testBookmark = makeBookmarkArray()
    
            beforeEach('insert bookmarks', () => {
            return db
                .into('bookmark_reviews')
                .insert(testBookmark)
            })
    
            it('responds with 204 and removes the bookmark', () => {
            const idToRemove = 1
            const expectedBookmarks = testBookmark.filter(book => book.id !== idToRemove)
            return supertest(app)
                .delete(`/bookmarks/${idToRemove}`)
                .expect(204)
                .then(res =>
                supertest(app)
                    .get(`/bookmarks`)
                    .expect(expectedBookmarks)
                )
            })
        })
    })
})