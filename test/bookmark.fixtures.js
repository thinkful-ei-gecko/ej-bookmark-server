function makeBookmarkArray(){
    return [
        {
            id: 1,
            bookmark_name: 'Lion King',
            bookmark_desc: 'The lions son takes over and rises to the top',
            bookmark_website: 'https://www.google.com',
            bookmark_rating: 5
        },
        {
            id: 2,
            bookmark_name: 'Harry Potter',
            bookmark_desc: 'Wizards fighting against each other',
            bookmark_website: 'https://www.google.com',
            bookmark_rating: 4
        },
        {
            id: 3,
            bookmark_name: 'Wizard of Oz',
            bookmark_desc: 'Too old of a story',
            bookmark_website: 'https://www.google.com',
            bookmark_rating: 2
        },
        {
            id: 4,
            bookmark_name: 'LOTR',
            bookmark_desc: 'Boring story',
            bookmark_website: 'https://www.google.com',
            bookmark_rating: 1
        }
    ];
}

module.exports = {
    makeBookmarkArray
}