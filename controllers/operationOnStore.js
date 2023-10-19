
const asyncWrapper = require("../middlewares/asyncWrapper");
const Book = require("../models/product.model");
const User = require("../models/user");
const mongodb = require("mongodb")
const Order = require("../models/order.medel")
const Delivery = require("../models/delivery.model")
const DeliveryBoy = require("../models/delivery.boy")
const { v4: createUuid } = require("uuid")
const stripe = require("stripe")("sk_test_51NNH3OSCI5qRRjQxIL6rITrpj3FWXIv1KClNKXlU7As2nnPYsRpjlnbqxDz37bIHc5mHljfw3Xxb6DhkRgM9UtOe007dNCApyz");
const speakeasy = require("speakeasy");
const twilio = require("twilio")
const accountSid = "AC22f5e0d449946d605567e39b778dc58f"
const authToken = "ca25ce743108c9ce122b0b089975fe60"
const twilioClient = twilio(accountSid, authToken)
const secret = speakeasy.generateSecret({ length: 20 })
const userSecrets = {}
const addProduct = asyncWrapper(async (req, res) => {
    const { originalname } = req.file
    console.log({ ...req.body, image: originalname });
    console.log(req.body.genres.split(",").map(genre => genre.trim()));
    const discountsType = req.body.discountsType.split(",").map(discountType => discountType.trim())
    const discountsAmount = req.body.discountsAmount.split(",").map(discountAmount => parseFloat(discountAmount.trim()))
    const newBook = await Book({
        ...req.body,
        image: originalname,
        genres: req.body.genres.split(",").map(genre => genre.trim()),
        formats: req.body.formats.split(",").map(format => format.trim()),
        keywords: req.body.keywords.split(",").map(keyword => keyword.trim()),
        discounts: discountsType.map((type, index) => ({
            discountType: type,
            amount: discountsAmount[index]
        }))
    });
    await newBook.save()
    res.status(200).json({
        success: true,
        status: 200,
        newBook
    })
});
const getReviews = async (req, res) => {
    try {
        const productId = req.params.query
        const isProduct = await Book.findOne({ _id: productId })
        if (!isProduct) {
            return res.json({ message: "Rroduct is not found!", isGetReviews: false })
        }
        const productID = new mongodb.ObjectId(`${productId}`)
        const reviewersID = await Book.aggregate([{ $match: { _id: productID } }, { $unwind: "$reviews" }, { $group: { _id: null, reviewersId: { $push: "$reviews.userID" } } }])
        console.log(reviewersID);
        const [{ reviews }] = await Book.aggregate([{ $match: { _id: productID } }, { $project: { _id: 0, reviews: { $map: { input: "$reviews", as: "item", in: { username: "$$item.username", userID: "$$item.userID", rating: "$$item.rating", reviewsText: "$$item.reviewsText" } } } } }])
        console.log(reviews);
        const [{ reviewersId }] = reviewersID
        const reviewers = await User.find({ _id: { $in: reviewersId } }, { password: 0 })
        // reviewers.password=undefined
        console.log(reviewers);
        return res.json({
            isGetReviews: true,
            reviewers,
            reviews
        })
    } catch (error) {
        return res.status(500).json({
            isGetReviews: false
        })
    }
}
const addReviews = asyncWrapper(async (req, res) => {
    const { productID, userID, rating, username, reviewsText } = req.body;
    console.log("add");
    const newReview = {
        username: username,
        userID: userID,
        rating: rating,
        reviewsText: reviewsText
    }
    const product = await Book.findOne({ $and: [{ _id: productID }, { reviews: { $not: { $elemMatch: { userID: userID } } } }] })
    console.log(product);
    if (!product) {
        return res.status(401).json({ message: "This product is not available" })
    }
    product.reviews.push(newReview)
    const totalRater = product.reviews.length
    const totalRating = product.reviews.reduce((sum, review) => sum + review.rating, 0)
    const averageRating = totalRater > 0 ? totalRating / totalRater : 0;
    product.rating = averageRating.toFixed(1)
    await product.save()
    res.json({
        isAddRating: true
    })
})
const getProduts = asyncWrapper(async (req, res) => {
    const genres = req.params.query || null;
    let books;
    if (genres) {
        console.log(genres);
        books = await Book.find({ keywords: { $in: [genres] } })

    } else {
        books = await Book.find({})
    }
    res.status(200).json({
        success: true,
        status: 200,
        books
    })
});

const getSingleProduts = asyncWrapper(async (req, res) => {
    const target = req.params.query;
    const product = await Book.findOne({ _id: target })
    res.status(200).json({
        product
    })
})
const orderController = async (req, res) => {
    try {
        const { action, customerID } = req.query
        console.log("order")
        if (action === "getOrders") {
            const ordersItemsID = await Order.aggregate([{ $match: { customerID: customerID } }, { $unwind: "$orderItems" }, { $group: { _id: null, itemsId: { $push: "$orderItems.productID" } } }])
            const orders = await Order.find({ customerID: customerID })
            const [{ itemsId }] = ordersItemsID
            console.log(itemsId);
            const orderproducts = await Book.find({ _id: { $in: itemsId } })
            return res.json({ orderproducts,orders })
        }
        else if (action === "createOrder") {
            console.log(req.body);
            const [newOrder] = await Order.insertMany({
                customerID: customerID,
                orderDate: Date.now(),
                ...req.body,
                paymentStatus: "paid",
            })
            return res.json(newOrder)
        }
    } catch (error) {
        console.log("error");
        console.log(error);
    }

}

const deliveryController = asyncWrapper(async (req, res) => {
    const { action, orderID } = req.query
    console.log("delivey")
    if (action === "getDelivery") {
        console.log(action, orderID);
        const [delivery] = await Delivery.find({ order_id: orderID })
        console.log(delivery);
        return res.json(delivery)
    }
    else if (action === "createDelivery") {
        const [newDelivery] = await Delivery.insertMany({
            ...req.body,
            delivery_id: `delivery_Id_${Date.now()}-${createUuid()}`,

        })
        console.log(newDelivery)
        res.json(newDelivery)
    }
    else if (action === "updateDelivery") {
        console.log(".......", action);
        const { progressName, ...updateInfo } = req.body
        console.log(progressName);
        const delivery = await Delivery.updateOne({ order_id: orderID }, {
            $set: { [`deliveryStatus.${progressName}`]: updateInfo }
        })
        await Order.updateOne({ orderID: orderID }, {
            $set: {
                orderStatus: `${progressName !== "delivered" ? "process" : progressName}`
            }
        })
        console.log(delivery);
        return res.json({ delivery })
    }

})


const boyController = async (req, res) => {
    console.log("boy")
    const { action, lat, lng } = req.query

    if (action === "createBoy") {

    }
    else if (action === "getBoy") {
        const [{ _id }] = await DeliveryBoy.aggregate([{
            $geoNear: {
                near: { type: "Point", coordinates: [parseFloat(lng), parseFloat(lat)] },
                distanceField: "distance",
                spherical: true
            }
        }, { $limit: 1 }]);
        console.log(res);
        return res.json({ id: _id })
    }
    else if (action === "updateBoy") {

    }

}

const otpGenerater = async (req, res) => {
    const { userId, mobnumber } = req.body
    console.log(req.body);
    const otp = speakeasy.totp({
        secret: secret.base32,
        encoding: "base32"
    })
    //set the expiration time (e.g 1min )
    console.log(Date.now());
    const expirationTime = Date.now() + 1 * 60 * 1000
    console.log(otp);
    // console.log("secret", secret);
    userSecrets[userId] = {
        secret: secret.base32,
        expirationTime: expirationTime
    }
    console.log(userSecrets);
    twilioClient.messages.create({
        body: `your otp ${otp}`,
        from: "+16505675769",
        to: mobnumber
    })
        .then(() => {
            res.json({ isOtpGenerate: true, message: "OTP SUCCESSFULY SEND" })
        })
        .catch((error) => {
            console.log(error);
            res.status(500).json({ message: "Error Sending otp",isOtpGenerate: false })
        })
}

const otpVerify = async (req, res) => {
    const { userId, userEnteredOTP } = req.body
    console.log(req.body);
    const userSecretData = userSecrets[userId]
    if (!userSecretData) {
        return res.status(400).json({ message: "secret key not found for this user", isOtpVerify: false })
    }
    const { expirationTime } = userSecretData
    if (Date.now > expirationTime) {
        return res.status(400).json({ message: "OTP has expired", isOtpVerify: false })
    }
    const verified = speakeasy.totp.verify({
        secret: secret.base32,
        encoding: "base32",
        token: userEnteredOTP,
        window: 1
    })
    console.log("verified ", verified);
    if (verified) {
        res.json({ message: "OTP is valid", isOtpVerify: true })
    } else {
        res.status(400).json({ message: "OTP Invalid", isOtpVerify: false })
    }
}

const createPayment = async (req, res) => {
    console.log("createPayment")
    const { amount, currency, orderToken } = req.body;
    try {
        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount,
            currency: currency,
            payment_method_types: ["card"],
            payment_method: orderToken
        })
        console.log(paymentIntent);
        res.json({ clientSecret: paymentIntent.client_secret })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}



module.exports = {
    getProduts,
    getSingleProduts,
    addProduct,
    addReviews,
    getReviews,
    orderController,
    deliveryController,
    boyController,
    createPayment,
    otpGenerater,
    otpVerify
}