require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const uuid = require('uuid/v4');
const { NODE_ENV } = require('./config');
const bookmarkRouter = require('./Bookmark.js');
const bookmarkItems = require('./bookmarks-Service.js');

const app = express();

//security for the application

const morganOption = (NODE_ENV === 'production')
  ? 'tiny'
  : 'common';

app.use(morgan(morganOption))
app.use(helmet())

//IMPLEMENTING DATABASE

app.get('/bookmarks', (req, res, next) => {
  const knexInstance = req.app.get('db')

  bookmarkItems.getAllBookmarks(knexInstance)
     .then(books => {
       res.json(books)
     })
     .catch(next)
})

app.get('/bookmarks/:id', (req, res, next) => {
  const knexInstance = req.app.get('db');

  bookmarkItems.getByBookmarkId(knexInstance, req.params.id)
    .then(book => {
      res.json(book)
    })
    .catch(next)
})

app.get('/', (req, res) => {
  res.send('Hello, boilerplate!')
})

// app.use(function validateBearerToken(req, res, next) {
//   const apiToken = process.env.API_TOKEN
//   const authToken = req.get('Authorization')

//   if (!authToken || authToken.split(' ')[1] !== apiToken) {
//     logger.error(`Unauthorized request to path: ${req.path}`);
//     return res.status(401).json({ error: 'Unauthorized request' })
//   }
//   // move to the next middleware
//   next()
// })

// app.use(bookmarkRouter);

//error handling (default)

app.use(function errorHandler(error, req, res, next) {
       let response
       if (NODE_ENV === 'production') {
         response = { error: { message: 'server error' } }
       } else {
         response = { message: error.message, error }
       }
       res.status(500).json(response)
     })

app.use(cors())

module.exports = app