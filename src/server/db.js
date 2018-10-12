const mongoose = require('mongoose');

const db = mongoose.createConnection('mongodb://localhost:27017/db', { useNewUrlParser: true });

module.exports = db;
