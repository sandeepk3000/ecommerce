const mongoose = require("mongoose");
const deliverySchema = new mongoose.Schema({
    delivery_id: {
        type: String,
        unique: true,
        require: true
    },
    order_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order"
    },
    driverID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "DeliveryBoy"
    },
    customer_name:{
        type:String
    },
    customer_contact: [String],
    delivery_address: {
        type: Object
    },
    courier_company:{
        type:String
    },
    delivery_notes:{
        type:String
    },
    delivery_cost: Number,
    payment_status:{
        type:String
    },
    singnature_received: Boolean,
    feedback:{
        type:String
    },
    delivery_data_time:{
        type:String
    },
    estimated_delivery_time:{
        type:String
    },
    delivery_total: {
        type: Number
    },
    delivery_proof: [String],
    delivery_items: {
        type:
            [
                {
                    product_id: {
                        type: mongoose.Schema.Types.ObjectId,
                        ref: "Product"
                    },
                    product_name: {
                        type: String
                    }
                }
            ]
    },
    geolocation: {
        latitude: Number,
        longitude: Number
    },
    deliveryStatus: {
        confirmed: {
            status: { type: Boolean, default: false },
            startingTime: {
                type: String,
                default: null
            },
            currentProgress: {
                type: String,
                default: "0%"
            },
        },
        shepped: {
            status: { type: Boolean, default: false },
            startingTime: {
                type: String,
                default: null
            },
            currentProgress: {
                type: String,
                default: "0%"
            },
        },
        outForDelivery: {
            status: { type: Boolean, default: false },
            startingTime: {
                type: String,
                default: null
            },
            currentProgress: {
                type: String,
                default: "0%"
            },
        },
        delivered: {
            status: { type: Boolean, default: false },
            startingTime: {
                type: String,
                default: null
            },
            currentProgress: {
                type: String,
                default: "0%"
            },
        }
    }

})
const collection = "Delivery";
module.exports = mongoose.model(collection, deliverySchema);