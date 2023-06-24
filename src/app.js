const express = require("express");
const app = express();
const path = require("path")
const hbs = require("hbs");
const operationRoots = require("../routers/operationsRouter");
const upload = require("../controllers/publish.book");
const public_path = path.join(__dirname, "../public");
const viewsPath = path.join(__dirname, "../templates/views")
const partialsPath = path.join(__dirname, "../templates/partials")
app.use(express.static(public_path))
app.set("view engine", "hbs");
app.set("views", viewsPath)
hbs.registerPartials(partialsPath)
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.get("/workingArea",(req,res)=>[
    res.render("workingArea")
])
app.get("/single", (req, res) => {
    req.render("single")
})
app.get("/", (req, res) => {
    res.render("home");
})

app.use("/bookStore/operations", operationRoots)
module.exports = app;
