const mongoose = require("mongoose");
const connectToDB = () => {
    const uri = "mongodb://127.0.0.1:27017/shoppingWeb"
    const uri = "mongodb+srv://codejourney7:zbDrFK7owhKF4RVI@shopping.orl4rzr.mongodb.net/skecommerce?retryWrites=true&w=majority";
    return mongoose.connect(uri,{
        useNewUrlParser: true,
        useUnifiedTopology: true
    })

}

module.exports = connectToDB;
