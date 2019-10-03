process.env.TZ = 'UTC';
const { expect } = require('chai');
const knex = require('knex');
const app = require('../app');
const { makeBookmarkArray } = require('./bookmark.fixtures');

describe.only('Bookmark endpoints', function(){
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
    })

    context('Given there are bookmarks in the database', () => {
        const bookmarks = makeBookmarkArray();

        beforeEach('insert bookmark', () => {
            return db
                .into('bookmark_reviews')
                .insert(bookmarks)
        });

        it('GET /bookmarks responds with 200 and all of the bookmarks', () => {
            return supertest(app)
            .get('/bookmarks')
            .expect(200, bookmarks)
            // TODO: add more assertions about the body
        })

        it('GET /bookmarks/:bookmark_id responds with 200 and the specified bookmark', () => {
            const bookmarkId = 2
            const expectedBookmark = bookmarks[bookmarkId - 1]
            return supertest(app)
            .get(`/bookmarks/${bookmarkId}`)
            .expect(200, expectedBookmark)
        })
    })
})