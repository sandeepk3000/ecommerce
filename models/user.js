const mongoose = require("mongoose");

const creatStructure = new mongoose.Schema({
    // userID: {
    //     type: String,
    //     unique: true
    // },
    username: {
        type: String,
        require: true,
    },
    email: {
        type: String,
        require: true,
        unique: true
    },
    password: {
        type: String,
        require: true,
        unique: true
    },
    mobilenumber: {
        type: String,
        validate: {
            validator: function (mob) {
                return /^\d{10}$/.test(mob)
            }
        },
        message: props => `${props.value} is not valid 10-digit mobile number!`
    },
    fullName: {
        type: String,
        default:null
    },
    dateOfBirth: {
        type: String,
        default:null
    },
    addresses: {
        type: [
            {
                type: {
                    type: String
                },
                street: {
                    type: String
                },
                city: {
                    type: String
                },
                state: {
                    type: String
                },
                zip: {
                    type: String
                },
                locality:{
                    type:String
                }
            }
        ],
        default: []
    },
    gender: {
        type: String,
        default:"Male"
    },
    profilePicture: {
        type: String
    },
    preferredPaymentMethod: {
        type: String,
        default: "Credit Card"
    },
    wishList: {
        type: [
            {// you can add some other fields as per requirements
                productID: {
                    type: String
                }
            }
        ],
        default: []
    },
    cart: {
        type: [
            {
                productID: {
                    type: String
                },
                quantity: {
                    type: Number
                }
            }
        ],
        default: []
    },
    orderHistory:[String],
},{timestamps:true})

const newLocal = "user";
module.exports = mongoose.model(newLocal, creatStructure);