const mongoose = require("mongoose");
const deliverySchema = new mongoose.Schema({
    delivery_id: {
        type: String,
        unique: true,
        require: true
    },
    order_id: String,
    customer_name: String,
    customer_contact: [String],
    delivery_address: {
        type: Object
    },
    courier_company: String,
    driverID: String,
    delivery_notes: String,
    delivery_cost: Number,
    payment_status: String,
    singnature_received: Boolean,
    feedback: String,
    delivery_data_time: String,
    estimated_delivery_time: String,
    delivery_total: {
        type: Number
    },
    delivery_proof: [String],
    delivery_items: {
        type:
            [
                {
                    product_id: {
                        type: String
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
const collection = "delivery";
module.exports = mongoose.model(collection, deliverySchema);