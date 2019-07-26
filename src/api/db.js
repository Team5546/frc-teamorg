const mongoose = require('mongoose');

const db = mongoose.createConnection('mongodb://mongo:27017/db', { useNewUrlParser: true });

module.exports = db;
