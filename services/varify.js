// const jwt = require("jsonwebtoken");
// const asyncWrapper = require("../middlewares/asyncWrapper");



// const varifyToken = asyncWrapper(async(req,res)=>{
//     const token = req.body.token;
//     if(!token){
//         return res.json({valid:false})
//     }
//     jwt.verify(token,"sandeep@2003",(error,decoded)=>{
//         if(error){
//             return res.json({valid:false})
//         }
//         return res.json({valid:true})
//     })
// })
// module.exports = varifyToken;