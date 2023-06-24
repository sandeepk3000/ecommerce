const mongoose = require("mongoose");

const creatStructure= mongoose.Schema({
    title:String,
    discription:String,
    imgUrl:String,
    rating:Number,
    likes:Number,
    disLikes:Number,
    price:Number,
    // uplishDate:new Data()
})

const newLocal = "book";
module.exports = mongoose.model(newLocal,creatStructure);