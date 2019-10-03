const express = require('express');
const xss = require('xss');
const bookmarkItems = require('./bookmarks-Service');

const bookmarkRouter = express.Router();
const jsonParser = express.json();

const serializeBookmark = bookmark => ({
  id: bookmark.id,
  bookmark_name: xss(bookmark.bookmark_name),
  bookmark_desc: xss(bookmark.bookmark_desc),
  bookmark_website: xss(bookmark.bookmark_website),
  bookmark_rating: bookmark.bookmark_rating
})

//BOOKMARKS

bookmarkRouter
    .route('/')
    .get((req, res, next) => {
    const knexInstance = req.app.get('db')
  
    bookmarkItems.getAllBookmarks(knexInstance)
       .then(books => {
         res.json(books.map(serializeBookmark))
       })
       .catch(next)
    })
    .post(jsonParser, (req, res, next) => {
        const { bookmark_name, bookmark_desc, bookmark_website, bookmark_rating} = req.body
        const newBookmark = { bookmark_name, bookmark_desc, bookmark_website, bookmark_rating};

        for(const [key, value] of Object.entries(newBookmark)){
          if (value == null) {
            return res.status(400).json({
              error: {message: `Missing '${key}' in request body`}
            })
          }
        }

        bookmarkItems.insertBookmark(
        req.app.get('db'),
        newBookmark 
        )
        .then(bookmark => {
            res.status(201).location(`/bookmarks/${bookmark.id}`).json(serializeBookmark(bookmark))
        })
    .catch(next)
    })


//BOOKMARD ID
  
  bookmarkRouter
    .route('/:id')
    .all((req, res, next) => {
  
    bookmarkItems.getByBookmarkId(req.app.get('db'), req.params.id)
      .then(book => {
        if (!book){
          return res.status(404).json({
            error: {message: `Bookmark doesnt exist`}
          })
        }
        res.book = book;
        next()
      })
        .catch(next)
      })
    .get((req, res, next) => {
      res.json(serializeBookmark(res.bookmark))
    })
    .delete((req, res, next) => {
        bookmarkItems.deleteBookmark(
          req.app.get('db'),
          req.params.id
        )
        .then(() => {
          res.status(204).end()
        })
        .catch(next)
      })

  module.exports = bookmarkRouter