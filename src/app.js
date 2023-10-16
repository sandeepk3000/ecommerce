const express = require("express");
const app = express();
const http = require("http")
const server = http.createServer(app);
const io = require("socket.io")(server);
const path = require("path")
const hbs = require("hbs");
const cookieParser = require("cookie-parser")
const operationRoots = require("../routers/operationsRouter");
const accountRoutes = require("../routers/account.routes")
const public_path = path.join(__dirname, "../public");
const viewsPath = path.join(__dirname, "../templates/views")
const partialsPath = path.join(__dirname, "../templates/partials")
const authenticationJWT = require("../middlewares/authenticationJWT");
app.use(express.static(public_path));
app.set("view engine", "hbs");
app.set("views", viewsPath)
hbs.registerPartials(partialsPath)
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cookieParser())


const namespace1 = io.of("/detialsProvide")
const namespace2 = io.of("/cartQuantity")
namespace1.on("connection", (socket) => {
    socket.on("detailsUpdate", (orderID) => {
        socket.join(orderID)
    })
    socket.on("detailsUpdater", (orderID) => {
        namespace1.to(orderID).emit("currentDetails", orderID)
    })
    socket.on("leaveToProgress", (orderID) => {
        socket.leave(orderID)
        console.log("leaveToProgress");
    })
})
namespace2.on("connection", (socket) => {
    socket.on("quantityRoom", (userId) => {
        socket.join(userId)
    })
    socket.on("updateQuantity", ({updatedquantity,userId}) => {
console.log(updatedquantity,userId);
        namespace2.to(userId).emit("currentQuantity", updatedquantity)
    })
})




app.use("/bookStore/operations", operationRoots)
app.get("/workingArea", (req, res) => [
    res.render("workingArea")
])
app.use("/account", accountRoutes)
app.get("/single", (req, res) => {
    res.render("single", {
        user: req.data
    })
})

app.post("/varify", authenticationJWT)
app.get("/payment", (req, res) => {
    res.render("checkout")
})
app.get("/paymentinterface", (req, res) => {
    const referer = req.get("Referer")
    // if (!(referer && referer.includes("/single"))) {
    //     return res.status(403).send("Access denied")
    // }
    res.render("paymentInterface")
})
app.get("/orderDetails", (req, res) => {
    // const referer = req.get("Referer")
    // if (!(referer && referer.includes("/paymentInterface"))) {
    //     return res.status(403).send("Access denied")
    // }
    res.render("orderDetails")
})
app.get("/", (req, res) => {
    console.log(req.data);
    res.render("home", {
        user: req.data
    });
});
app.get("/login", (req, res) => {
    res.render("login")
})
app.get("/signup", (req, res) => {
    res.render("signup")
})
app.get("/singleProducts", (req, res) => {
    res.render("singleProducts")

})
app.get("/addToCart", (req, res) => {
    res.render("addToCart", {
        user: req.data

    })
})
app.get("/controller",(req,res)=>{
    res.render("controller", {
        user: req.data

    })
})
app.get("/orders",(req,res)=>{
    res.render("orders")
})
module.exports = server;
