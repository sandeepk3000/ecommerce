const express = require("express");
const app = express();
const path = require("path");
const operationRoots = require("../routers/operationsRouter")
const public_path =path.join(__dirname,"/public");

app.use(express.urlencoded({extended:true}))
app.use(express.json())
app.get("",(req,res)=>{
    res.send("sandeep Store")
})
app.use("/bookStore/operations",operationRoots)
module.exports= app;
