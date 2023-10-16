
const User = require("../models/user")
const asyncWrapper = require("./asyncWrapper");
const jwt = require("jsonwebtoken")
const authenticationJWT =asyncWrapper( async (req, res) => { 
    const jwtToken = req.body.jwtToken;
    if(!jwtToken){
        return res.json({isAuthenticated:false})
    }
    jwt.verify(jwtToken,"sandeep@2003",async(error,decoded)=>{
        // console.log(decoded);
        const user = await User.findById(decoded._doc._id)
        // console.log(user);
        if(error){
            return res.json({isAuthenticated:false})
        }
          return res.json({isAuthenticated:true,user:user});
    })
  
})
module.exports = authenticationJWT