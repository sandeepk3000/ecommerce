const mongoose = require("mongoose");

const creatStructure = mongoose.Schema({
    name: String,
    email: String,
    password: String,
    userCart:[]

})

const newLocal = "user";
module.exports = mongoose.model(newLocal, creatStructure);