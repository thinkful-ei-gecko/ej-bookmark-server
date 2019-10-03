const bookmarkItems = {
    getAllBookmarks(knex) {
        return knex.select('*').from('bookmark_reviews');
    },
    insertBookmark(knex, newItem) {
        return knex.insert(newItem).into('bookmark_reviews').returning('*')
        .then(rows => {
            return rows[0];
        })
    },
    getByBookmarkId(knex, id) {
        return knex.from('bookmark_reviews').select('*').where('id', id).first()
        },
    deleteBookmark(knex, id) {
        return knex('bookmark_reviews')
            .where({ id })
            .delete()
        },
    updateBookmark(knex, id, newItemInfo) {
        return knex('bookmark_reviews')
            .where({ id })
            .update(newItemInfo)
         },
}

module.exports = bookmarkItems