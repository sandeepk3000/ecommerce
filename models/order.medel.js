const mongoose = require("mongoose");
const orderItemsSchema = new mongoose.Schema({
    productID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product"
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
})
const orderSchema = new mongoose.Schema({
    // customerID: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref:"user"
    // },
    customerID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
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
    orderItems: [orderItemsSchema],
    orderStatus: {
        type: String,
        enum: ["PROCESS", "SHIPED"],
        default: "Pending"
    }

})
const collection = "Order";
module.exports = mongoose.model(collection, orderSchema);