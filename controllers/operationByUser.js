

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
    const{ target} = req.params
    const user = await User.findOne({_id:target}  )
    res.status(200).json({
        user
    })
})

const loginOnStore = asyncWrapper(async (req, res) => {
    const { name, email, password } = req.body;
    const isExitUser = await User.findOne({ email: email, password: password })
    if (isExitUser) {
        res.cookie("userId",isExitUser._id,{
            maxAge:3600000
        })
        res.redirect(`/?userLogin=true&&user=${isExitUser._id}`);
    } else {
        const user = await User.create({
            name: name,
            email: email,
            password: password
        })
        res.cookie("userId",user._id,{
            maxAge:3600000
        })
        res.redirect(`/?userLogin=true&&user=${user._id}`);
    }
})
const myCart = asyncWrapper(async (req, res) => {
    let updateUserRes;
    const productId = req.params;
    const {email,password,action}=req.body
    const isUserExit = await User.findOne({ email: email, password: password });
    if (isUserExit) {
        const addProduct = await User.findOne({ email: email, password: password, userCart: { $nin: [{ productId: productId }] } })
        console.log(addProduct);
        if (addProduct && action === "add") {
            updateUserRes = await User.updateOne({ _id: addProduct._id }, {
                $push: {
                userCart: {
                    productId: productId,
                    quantity: 1,
                }
            }
            })
        }
        if (!addProduct && action === "inc") {
            updateUserRes = await User.updateOne({ _id: addProduct._id }, {
                userCart: {
                    $gte: 1, $inc: {
                        quantity: 1
                    }
                }
            })
        }
        else {
            updateUserRes = await User.updateOne({ _id: addProduct._id }, {
                userCart: {
                    $gt: 0, $inc: {
                        quantity: -1
                    }
                }
            })
        }
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