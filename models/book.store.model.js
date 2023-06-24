const mongoose = require("mongoose");

const creatStructure = mongoose.Schema({
    title:String ,
    discription:String,
    imgUrl:String ,
    publishingdate:String ,
    author:String,
    publisher:String,
    edition:String ,
    nopage:String,
    language: String,
    likes:Number,
    disLikes:Number,
    rating:Number
})

const newLocal = "book";
module.exports = mongoose.model(newLocal, creatStructure);