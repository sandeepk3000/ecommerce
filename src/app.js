const express = require("express");
const http = require("http");
const path = require("path");
const hbs = require("hbs");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const operationRoots = require("../routers/operationsRouter");
const accountRoutes = require("../routers/account.routes");
const initializeSocket = require("../services/socket");
const isAuthenticated = require("../middlewares/auth");
const app = express();
const server = http.createServer(app);
const public_path = path.join(__dirname, "../public");
const viewsPath = path.join(__dirname, "../templates/views");
const partialsPath = path.join(__dirname, "../templates/partials");
app.use(express.static(public_path));
app.set("view engine", "hbs");
app.set("views", viewsPath);
hbs.registerPartials(partialsPath);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(
  session({
    secret: "r8q,+&1LM3)CD*zAGpx1xm{NeQhc;#",
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60 * 60 * 1000 }, // 1 hour
  })
);
initializeSocket(server);
app.use("/bookStore/operations", operationRoots);
app.use("/account", accountRoutes);
app.get("/", (req, res) => {
  console.log("/home");
  console.log(req.headers.l);
  res.render("home", {
    user: req.data,
  });
});
app.get("/single", (req, res) => {
  res.render("single");
});
app.get("/workingArea", (req, res) => [res.render("workingArea")]);
app.get("/paymentinterface", isAuthenticated, (req, res) => {
  const referer = req.get("Referer");
  // if (!(referer && referer.includes("/single"))) {
  //     return res.status(403).send("Access denied")
  // }
  res.render("paymentInterface");
});
app.get("/orderDetails", isAuthenticated, (req, res) => {
  // const referer = req.get("Referer")
  // if (!(referer && referer.includes("/paymentInterface"))) {
  //     return res.status(403).send("Access denied")
  // }
  res.render("orderDetails");
});
app.get("/login", (req, res) => {
  res.render("login");
});
app.get("/signup", (req, res) => {
  res.render("signup");
});
app.get("/singleProducts", (req, res) => {
  res.render("singleProducts");
});
app.get("/addToCart", isAuthenticated, (req, res) => {
  res.render("addToCart");
});
app.get("/controller", (req, res) => {
  res.render("controller", {
    user: req.data,
  });
});
app.get("/orders", isAuthenticated, (req, res) => {
  res.render("orders");
});
module.exports = server;
