const express = require('express');
const bookmarkRouter = express.Router();
const bodyParser = express.json();
const uuid = require('uuid/v4');
const logger = require('./logger');
const {bookMarks} = require('./store')

bookmarkRouter
    .route('/bookmarks')
    .get((req, res) => {
        res.json(bookMarks)
    })
    .post(bodyParser, (req, res) => {
        const {title, url, desc, rating} = req.body;
            const id = uuid();
            const bookmark = {
                title,
                url,
                desc,
                rating,
                id
            };

    if(!title) {
        logger.error('Title is required');
        return res.status(400).send('Invalid data(title)')
    }

    if(!url) {
        logger.error('Url is required');
        return res.status(400).send('Invalid data')
    }

    bookMarks.push(bookmark);

    logger.info(`Bookmark with id ${id} created`);

    res.status(201).location(`http://localhost:8000/card/${id}`).json(bookmark)
    
});

bookmarkRouter
    .route('/bookmarks/:id')
    .get((req, res) => {
    const { id } = req.params;
    const bookmark = bookMarks.find(c => c.id == id);

    if (!bookmark) {
    logger.error(`Bookmark with id ${id} not found.`)

    return res.status(404).send('Bookmark Not Found')
  }

  res.json(bookmark);
    })
    .delete((req, res) => {
        const { id } = req.params;
      
        const bookIndex = bookMarks.findIndex(book => book.id == id)
      
        //remove book from bookmarks
      
        if (bookIndex === -1){
          logger.error(`Bookmark with id ${id} not found`);
          return res.status(404).send('Not Found')
        }
      
        //NOT SURE IF THIS IS NEEDED 
        //bookMarks.forEach(book => {
        //   console.log(`inside for each ${id}`);
        //   // const id = book.id.filter(bid => bid !== id);
        //   // book.id = id;
        // });
      
        bookMarks.splice(bookIndex, 1);
      
        logger.info(`Bookmark with id ${id} deleted`)
      
        res.status(204).end();
})

module.exports = bookmarkRouter;