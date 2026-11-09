module.exports = {
    collectionQuery: 'SELECT * FROM actionCategories ORDER BY id',
    addQuery: 'INSERT INTO actionCategories (id, name, type) VALUES (?, ?, ?)',
    deleteQuery: 'DELETE FROM actionCategories',
};