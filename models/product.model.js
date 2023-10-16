const mongoose = require("mongoose");
const productSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true
    },
    description: {
        type: String,
        require: true
    },
    image: {
        require: true,
        type: String
    },
    sku: {
        type: String,
        default: null
    },
    price: {
        type: Number,
        require: true
    },
    availability: {
        type: String,
        default: "In Stock"
    },
    condition: {
        type: String,
        default: "New Product"
    },
    rating: {
        type: Number,
        default: 0.0
    },
    reviews: {
        type: [

            {
                username: String,
                userID: String,
                rating: Number,
                reviewsText: String
            }

        ],
        default: null
    },
    publishDate: {
        type: Date,
        default: null
    },
    weight: {
        type: String,
        default: null
    },
    dimensions: {
        type: String,
        default: null
    },
    materials: {
        type: String,
        default: null
    },
    shipping: {
        method:
        {
            type: String,
            default: null
        },
        cost: {
            type: Number,
            default: null
        },
        estimatedDelivery:
        {
            type: String,
            default: null
        }
    },
    upc: {
        type: String,
        default: null
    },
    ean: {
        type: String,
        default: null
    },
    mpn: {
        type: String,
        default: null
    },
    url: {
        type: String,
        default: null
    },
           
    discounts: {
        type: [
            {
                discountType: String,
                amount: Number
            }
        ],
        default: null
    },

},
    {
        discriminatorKey: "type"
    })
const newLocal = "Product";

module.exports = mongoose.model(newLocal, productSchema);