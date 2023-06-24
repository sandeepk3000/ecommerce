// const async = require("hbs/lib/async")
const Book = require("../models/book.store.model")


const pubLishBook = async (req, res) => {
    try {
        const {originalname}=req.file
        const { book, author, publishingdate,publisher,edition,nopage,language } = req.body;
        const thisBookPubLished = await Book.create({
            title: book,
            // discription: discription,
            imgUrl: originalname,
            publishingdate:publishingdate ,
            author:author,
            publisher:publisher,
            edition:edition,
            nopage:nopage,
            language:language
        });
        res.status(200).json({
            success: true,
            status: 200,
            thisBookPubLished
        })
        console.log(thisBookPubLished);
    } catch (error) {
        res.status(500).json({
            success: false,
            status: 200,
            message: "500 Opp's Error"
        })
    }
}

const getBookStore = async (req, res) => {
    try {
        const books = await Book.find({}).limit(2)
        res.status(200).json({
            success: true,
            status: 200,
            books
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            status: 500,
            message: "500 Opp's Error"
        })
    }
}

const getSingleBook = async (req, res) => {
    try {
        const target= req.params.query;
        console.log(target);
        const book = await Book.findOne({ _id: target })
        res.status(200).json({
            book
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            status: 500,
            message: "500 Opp's Error"
        })
    }
}
const likeAndDisLikeOnProducts = async (req, res) => {
    try {
        const [flag, target] = req.params.query.split("&&");

        if (flag.toLocaleLowerCase() === "like") {
            await Book.updateOne({ _id: target }, {
                $inc: {
                    likes: 1
                }
            })
        }
        if (flag.toLocaleLowerCase() === "dislike") {
            await Book.updateOne({ _id: target }, {
                $inc: {
                    disLikes: 1
                }
            })
        }
        else {
            await Book.updateOne({ _id: target }, {
                $inc: {}
            })
        }
        res.status(200).json({
            success: true
        })
    } catch (error) {
        console.log("patch");
        res.status(500).json({
            success: false,
            status: 200,
            message: "500 Opp's Error"
        })
    }
}

module.exports = {
    getBookStore,
    getSingleBook,
    pubLishBook,
    likeAndDisLikeOnProducts
}