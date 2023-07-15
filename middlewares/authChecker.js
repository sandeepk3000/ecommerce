const User = require("../models/user.login.model")
const asyncWrapper = require("./asyncWrapper");
const authChecker = asyncWrapper(async (req, res, next) => {

    const { userId } = req.cookies;
    const status = {
        loginStatus: "login"
    }
    const user = await User.findOne({ _id: userId })
    if (user) {
        req.data = {
            ...user,
            ...status,
            loginStatus: "loged"
        }
    } else {
        req.data = status
    }
    next()
})
module.exports = authChecker