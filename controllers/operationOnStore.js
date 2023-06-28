
const asyncWrapper = require("../middlewares/asyncWrapper");
const Book = require("../models/book.store.model")
const stripe = require("stripe")('sk_test_51NNH3OSCI5qRRjQxIL6rITrpj3FWXIv1KClNKXlU7As2nnPYsRpjlnbqxDz37bIHc5mHljfw3Xxb6DhkRgM9UtOe007dNCApyz');
const pubLishBook = asyncWrapper(async (req, res) => {
    const { originalname } = req.file
    const { book, category, author, publishingdate, publisher, edition, nopage, language, discription } = req.body;
    const thisBookPubLished = await Book.create({
        title: book,
        discription: discription,
        category: category,
        imgUrl: originalname,
        publishingdate: publishingdate,
        author: author,
        publisher: publisher,
        edition: edition,
        nopage: nopage,
        language: language
    });
    res.status(200).json({
        success: true,
        status: 200,
        thisBookPubLished
    })
});

const getBookStore = asyncWrapper(async (req, res) => {
    const books = await Book.find({})
    console.log("getStroe");
    res.status(200).json({
        success: true,
        status: 200,
        books
    })
});

const getSingleBook = asyncWrapper(async (req, res) => {

    const target = req.params.query;
    console.log(target);
    const book = await Book.findOne({ _id: target })
    res.status(200).json({
        book
    })
})

const paymentsNow = asyncWrapper(async (req, res) => {
    // const calculateOrderAmount = (items) => {
    //     // Replace this constant with a calculation of the order's amount
    //     // Calculate the order total on the server to prevent
    //     // people from directly manipulating the amount on the client
    //     return 1400;
    // };
    const { items } = req.body;
    console.log(items);
    // Create a PaymentIntent with the order amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
        // amount: calculateOrderAmount(items),
        amount: 100 * 100,
        currency: "usd",
        automatic_payment_methods: {
            enabled: true,
        },
    });
    res.send({
        clientSecret: paymentIntent.client_secret,
    });
})



module.exports = {
    getBookStore,
    getSingleBook,
    pubLishBook,
    paymentsNow
}