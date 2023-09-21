const mongoose = require('mongoose');

const bookSchema = mongoose.Schema({
    title: String,
    author: String,
    category: String,
    price: Number,
    quantity: Number
});

const BookModel = mongoose.model("Book", bookSchema)
module.exports = { BookModel }