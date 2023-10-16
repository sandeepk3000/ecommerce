const mongoose = require("mongoose");
const orderSchema = new mongoose.Schema({
    // customerID: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref:"user"
    // },
    customerID: {
        type:String,
    },
    orderID: {
        type: String,
        unique: true,
        require: true
    },
    orderDate: {
        type: String
    },
    orderTotal: {
        type: Number
    },
    shippingAddress: {
        type: Object
    },
    billingAddress: {
        type: Object
    },
    paymentMethod: {
        type: String
    },
    paymentStatus: String,
    orderItems: {
        type: [
            {
                productID: {
                    type: String
                },
                productName: {
                    type: String
                },
                quantity: {
                    type: Number
                },
                unitPrice: {
                    type: Number
                },
                subTotal: {
                    type: Number
                }
            }
        ]
    },
    orderStatus: {
        type: String,
        default: "Pending"
    }

})
const collection = "order";
module.exports = mongoose.model(collection, orderSchema);