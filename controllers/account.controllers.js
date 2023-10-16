
const Book = require("../models/product.model")
const User = require("../models/user")
const asyncWrapper = require("../middlewares/asyncWrapper")
const bcrypt = require("bcryptjs")
const mongodb = require("mongodb")
const jwt = require("jsonwebtoken")
const { v4: generateOrderId } = require("uuid")
// const user = require("../models/user")
const likeAndDisLikeOnProducts = asyncWrapper(async (req, res) => {
    console.log("ckecked");
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
        success: true,
        home: "himek"
    })

})

const getUser = asyncWrapper(async (req, res) => {
    const { target } = req.params
    const user = await User.findOne({ _id: target })
    res.status(200).json({
        user
    })
})

const signUp = asyncWrapper(async (req, res) => {
    const { name, email, password } = req.body;
    const exitUser = await User.findOne({ email: email, password: password })
    // here  checking exitUser is already exists or not
    if (exitUser) {
        return res.status(409).json({ message: "User with this email already exists" })
    }
    // hash the password
    const hashedPassword = await bcrypt.hash(password, 10)

    // here create a new user
    const user = await User({ username: name, email, password: hashedPassword, moblileNO: "7007703489" })
    await user.save()
    // res.cookie("user", { cartValue: user.cart.length, userId: user._id, status: true }, {
    //     maxAge: 3600000
    // })
    const token = jwt.sign({ ...user, password: undefined }, "sandeep@2003", {
        expiresIn: "2h"
    })
    user.token = token
    user.password = undefined
    //here send response
    res.status(201).json(user)
})
// add function

const login = asyncWrapper(async (req, res) => {
    const { email, password } = req.body;
    console.log(req.body);
    console.log("login");
    // Find the user by email
    const user = await User.findOne({ email })
    if (!user) {
        return res.status(401).json({ message: "Invalid email or password" })
    }
    //Compare the password

    const isPasswordMatch = await bcrypt.compare(password, user.password)
    if (!isPasswordMatch) {
        return res.status(401).json({ message: "Invalid email or password" })
    }
    const token = jwt.sign({ ...user, password: undefined }, "sandeep@2003")
    user.token = token;
    user.password = undefined;
    const options = {
        expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        httpOnly: true
    }
    res.status(200).cookie("token", token, options).json({
        success: true,
        token,
        user
    })
})



async function getPage(req, res) {
    console.log(req.query);
    let queryString = new URLSearchParams(req.query)
    const action = queryString.get("action")
    const target = queryString.get("target")
    const user = await User.findOne({ _id: target })
    console.log(user);
    try {
        switch (action) {
            case "changePassword":
                console.log(action);
                res.render("changePassword",user)
                break;
            case "changeNumber":
                console.log(action);
                res.render("changeNumber",user)
                break;
            case "changeList":
                console.log(action);
                res.render("changeList",user)
                break;
            case "changeName":
                res.render("changeName",user)
                break;
            case "profile":
                console.log(action);
                res.render("profile")
                break;
            case "changeemail":
                console.log(action);
                res.render("userAccount",user)
                break;
            case "orders":
                console.log(action);
                res.render("orders",user)
                break;
            case "single":
                console.log(action);
                res.render("single")
                break;
            case "orderDetails":
                console.log(action);
                res.render("orderDetails")
                break;
            case "singleProducts":
                console.log(action);
                res.render("singleProducts")
                break;
            case "singleProducts":
                console.log(action);
                res.render("singleProducts")
                break;
        }
        return;
    } catch (error) {

    }
}

const changeUserInfo = async (req, res) => {
    try {
        let updatedUser = null;
        const { action, userId } = req.query
        const ObjectId = new mongodb.ObjectId(`${userId}`)
        const isUserExit = await User.findOne({ _id: ObjectId });
        console.log(isUserExit);
        if (!isUserExit) {
            console.log("isUser Exit not");
            return res.json({ message: false })
        }
        switch (action) {
            case "pushAddress":
                const { moblileNumber, type, city, street, locality, zip, state } = req.body
                updatedUser = await User.updateOne({ _id: ObjectId, addresses: { $not: { $elemMatch: { type: type } } } }, {
                    $push: {
                        addresses: {
                            city: city,
                            type: type,
                            street: street,
                            zip: zip,
                            state: state,
                            locality: locality
                        }
                    }
                })
                break
            case "updateAddress":
                updatedUser = await User.updateOne({ _id: ObjectId, addresses: { $elemMatch: { type: type } } }, {
                    $set: {
                        // jo match hua hai usaki position find kerata hai $ sign
                        "addresses.$.city": city,
                        "addresses.$.type": type,
                        "addresses.$.locality": locality,
                        "addresses.$.state": state,
                        "addresses.$.zip": zip,
                        "addresses.$.street": street
                    }
                })
                break
            case 'orderHistory':
                const orderID = `order_Id_${Date.now()}-${generateOrderId()}`;
                await User.updateOne({ _id: ObjectId }, {
                    $push: {
                        orderHistory: orderID
                    }
                })
                updatedUser = { orderID: orderID }
                break
            case "email":
                const { newEmail } = req.body;
                updatedUser = await User.updateOne({ _id: ObjectId }, {
                    $set: { "email": newEmail }
                })
                break
            case "name":
                const { newname } = req.body;
                updatedUser = await User.updateOne({ _id: ObjectId }, {
                    $set: { "username": newname }
                })
                break
            case "password":
                const { newpassword, currentpassword } = req.body;
                console.log(req.body);
                const userPassword = isUserExit.password
                const isPasswordMatch = await bcrypt.compare(currentpassword, userPassword)
                if (!isPasswordMatch) return;
                const newHashedPassword = await bcrypt.hash(newpassword, 10)
                updatedUser = await User.updateOne({ _id: ObjectId }, {
                    $set: { "password": newHashedPassword }
                })
                break
            case "mobnumber":
                const { newnumber } = req.body;
                updatedUser = await User.updateOne({ _id: ObjectId }, {
                    $set: { "mobilenumber": newnumber }
                })
                break
            case "profileImage":

                break
        }
        return res.json({ message: "user successfully updated!", isUpdated: true, ...updatedUser })
    } catch (error) {
        console.log(error);
    }

}
const myCart = asyncWrapper(async (req, res) => {
    const userId = req.params.query;
    // console.log(userId);
    const isUserExit = await User.findOne({ _id: userId });
    if (req.method === "PATCH" && isUserExit) {
        const { action, productId } = req.body
        console.log(action, productId, userId);
        const cart = await User.findOne({ _id: userId, cart: { $elemMatch: { productID: productId } } })
        console.log(cart);
        switch (action) {
            case "addToCart":
                await User.updateOne({ _id: userId, cart: { $not: { $elemMatch: { productID: productId } } } }, {
                    $addToSet: {
                        cart: {
                            productID: productId,
                            quantity: 1
                        }
                    }
                })
                return res.json({ message: "Item add successfully!", status: true })
                break;
            case "quantityInc":
                console.log(action, productId);
                await User.updateOne({ cart: { $elemMatch: { productID: productId, quantity: { $gte: 1 } } } }, {
                    $inc: { "cart.$.quantity": 1 }
                })
                //in mongodb $ the positional operator is used to identify the index of the element in an array that matches 
                //$ =[index].quantity
                // here you also use "cart.productID" or $elemMatch
                return res.json({ message: "Item quantity increase successfully!", status: true })
                break;
            case "quantityDcr":
                await User.updateOne({ cart: { $elemMatch: { productID: productId, quantity: { $gte: 1 } } } }, {
                    $inc: { "cart.$.quantity": -1 }
                })
                // await User.updateOne({ cart: { $elemMatch: { productID: productId, quantity: { $eq: 1} } } }, {
                //     $pull:{
                //         cart:{productID:productId}
                //     }
                // })
                return res.json({ message: "Item quantity decreases successfully!", status: true })
                break;

            case "removeFromCart":
                await User.updateOne({ cart: { $elemMatch: { productID: productId } } }, {
                    $pull: { "cart": { productID: productId } }
                })
                return res.json({ message: "Item remove successfully!", status: true })
                break;
        }

    }
    if (req.method === "GET" && isUserExit) {
        // console.log(userId);
        // console.log(isUserExit);
        const ObjectId = new mongodb.ObjectId(`${userId}`)
        const cartProductsID = await User.aggregate([{ $match: { _id: { $eq: ObjectId } } }, { $unwind: "$cart" }, { $group: { _id: null, cartproductsID: { $push: "$cart.productID" } } }])
        
        const [{ cartproductsID }] = cartProductsID
        const cartQuantities = isUserExit.cart
        const cartProducts = await Book.find({ _id: { $in: cartproductsID } })
        return res.status(200).json({
            cartProducts,
            cartQuantities

        })
    }
    return res.json({ message: "Item not found", status: false })
})
module.exports = {
    myCart,
    getUser,
    signUp,
    login,
    changeUserInfo,
    likeAndDisLikeOnProducts,
    getPage
}