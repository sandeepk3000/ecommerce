
const Book = require("../models/book.store.model")
const User = require("../models/user.login.model")
const asyncWrapper = require("../middlewares/asyncWrapper")
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
        success: true
    })

})

const getUser = asyncWrapper(async (req, res) => {
    const { target } = req.params
    const user = await User.findOne({ _id: target })
    res.status(200).json({
        user
    })
})

const loginOnStore = asyncWrapper(async (req, res) => {
    const { name, email, password } = req.body;
    const isExitUser = await User.findOne({ email: email, password: password })
    if (isExitUser) {
        res.cookie("userId", isExitUser._id, {
            maxAge: 3600000
        })
        res.redirect(`/?userLogin=true&&user=${isExitUser._id}`);
    } else {
        const user = await User.create({
            name: name,
            email: email,
            password: password
        })
        res.cookie("userId", user._id, {
            maxAge: 3600000
        })
        res.redirect(`/?userLogin=true&&user=${user._id}`);
    }
})
const myCart = asyncWrapper(async (req, res) => {
    const userId = "649bb6ccfbc99fa27ed3f425";
    let updateUserRes;
    const isUserExit = await User.findOne({ _id: userId });
    if (isUserExit && req.method === "PATCH") {
        const [action, productId] = req.params.query.split("&&")
        console.log(action,productId);
        const { userCart } = await User.findOne({ _id: userId }, { userCart: { $elemMatch: { productId: productId } } })
        console.log(userCart);
        if (userCart.length === 0 && action === "addToCart") {
            updateUserRes = await User.updateOne({ _id: userId }, {
                $push: {
                    userCart: {
                        productId: productId,
                        quantity: 1,
                    }
                }
            })
        }
        if(userCart.length!==0&& action === "addToCart" ){
            updateUserRes ={
                modifiedCount:0
            }
        }
        if (userCart.length !== 0 && action === "quantityInc") {
            updateUserRes = await User.updateOne({ $and: [{ _id: userId, userCart: { $elemMatch: { "quantity": { $gte: 1 }, "productId": productId } } }] }, {
                $inc: { "userCart.$.quantity": 1 }
            })
        }
        if (userCart.length !== 0 && action === "quantityDcr") {
            updateUserRes = await User.updateOne({ $and: [{ _id: userId, userCart: { $elemMatch: { "quantity": { $gt: 1 }, "productId": productId } } }] }, {
                $inc: { "userCart.$.quantity": -1 }
            })
            if (updateUserRes.matchedCount === 0) {
               const  res = await User.updateOne({ "userCart.productId": productId, "userCart.quantity": 1 }, {
                    $pull: {
                        userCart: { quantity: 1, productId: productId }
                    }
                })
                updateUserRes={
                    res,
                    productAcctive:false
                }
            }
        }
        if (userCart.length!==0 && action === "removeFromCart") {
            const [item ]= userCart
            const  res = await User.updateOne({$and:[{_id:userId},{userCart:item}]},{
                $pull: {
                    userCart:item
                }
            })
             updateUserRes={
                 res,
                 productAcctive:false
             }
         }

    }
    if ( isUserExit&&req.method === "GET") {
        const { userCart } = await User.findOne({ _id: userId }, {userCart:1})
        updateUserRes = await User.aggregate([{ $match: { email: isUserExit.email } }, { $group: { _id: isUserExit._id, userCartId: { $push: "$userCart.productId" } } }])
        console.log(updateUserRes);
        const [{ userCartId }] = updateUserRes;
        const [id] = userCartId
        updateUserRes=[
            {
                cartProducts:await Book.find({ _id: { $in: id } }),
                quantity:userCart
            }
        ]
       
    }
    res.status(200).json({
        updateUserRes
    })
})
module.exports = {
    myCart,
    getUser,
    loginOnStore,
    likeAndDisLikeOnProducts
}