const errorHandler = (err,req,res,next)=>{
    console.log("error");
   res.status(500).json({error:"Internal Server Error"})
}
module.exports = errorHandler