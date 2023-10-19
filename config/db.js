const mongoose = require("mongoose");
const connectToDB = ()=>{
    console.log(process.env.DATABASE_URL);
    const uri = "mongodb+srv://codejourney7:zbDrFK7owhKF4RVI@shopping.orl4rzr.mongodb.net/skecommerce?retryWrites=true&w=majority";

    return mongoose.connect(uri,{
        useNewUrlParser:true,
        useUnifiedTopology:true
    })
    
}

module.exports = connectToDB;
