const express = require("express");
const app = express();
const path = require("path")
const hbs = require("hbs");
const cookieParser = require("cookie-parser")
const operationRoots = require("../routers/operationsRouter");
const userOperations = require("../routers/user.operations")
const public_path = path.join(__dirname, "../public");
const viewsPath = path.join(__dirname, "../templates/views")
const partialsPath = path.join(__dirname, "../templates/partials")
const errorHandler = require("../middlewares/errorHandling");
const authChecker = require("../middlewares/authChecker");
app.use(express.static(public_path));
app.set("view engine", "hbs");
app.set("views", viewsPath)
hbs.registerPartials(partialsPath)
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(errorHandler)
app.use(cookieParser())
app.use("/bookStore/operations", operationRoots)
app.get("/workingArea", (req, res) => [
    res.render("workingArea")
])
app.use("/user/operations",userOperations)
app.get("/single",authChecker,(req, res) => {
    res.render("single",{
        data:req.data
    })
})
app.get("/payment",(req,res)=>{
    res.render("checkout")
})
app.get("/",authChecker, (req, res) => {
    console.log(req.data);
    res.render("home",{
        data:req.data
    });
});
app.get("/login",(req,res)=>{
    res.render("login")
})
app.get("/singleProducts",authChecker,(req,res)=>{
    res.render("singleProducts",{
        data:req.data
    })
})
module.exports = app;
