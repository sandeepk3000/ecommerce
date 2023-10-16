const mongoose = require("mongoose");
const Product = require("./product.model")
const bookSchema = new mongoose.Schema({
    genres: {
        type: [String],
        default: null
    },
    author: {
        type: String,
        default: null
    },
    ISBN: {
        type: String,
        default: null
    },
    pageCount: {
        type: Number,
        default: null
    },
    publisher: {
        type: String,
        default: null
    },
    language: {
        type: String,
        default: null
    },
    edition: {
        type: String,
        default: null
    },
    formats: {
        type: [String],
        default: null
    },
},
{
        extends: Product,
        discriminatorKey: "type"
})

const newLocal = "book";
module.exports = mongoose.model(newLocal, bookSchema);