
const User = require("../models/user")
const asyncWrapper = require("./asyncWrapper");
const jwt = require("jsonwebtoken")
const authenticationJWT = asyncWrapper(async (req, res) => {
    const { jwtToken } = req.body;
    console.log(jwtToken);
    let auth;
    if (!jwtToken) {
        return res.json({ isLogged: false })
    } else {
        jwt.verify(jwtToken, process.env.JWT_PRIVATE_KEY, async (error, decoded) => {
            const currentTimestamp = Math.floor(Date.now() / 1000)
            if (decoded.exp > currentTimestamp) {
                const user = await User.findById(decoded._doc._id)
                return res.json({ isLogged: true, isTokenExpired: false,user:user})
            } else {
                console.log(error);
                return res.json({ isLogged: false, isTokenExpired: true })
            }

        })

    }
})


module.exports = authenticationJWT