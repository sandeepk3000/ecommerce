const express = require("express")
const router = express.Router();
const {getBookStore,getSingleBook,pubLishBook,paymentsNow}= require("../controllers/operationOnStore");
const upload = require("../controllers/book.uploader");
router.route("/").get(getBookStore);
router.route("/:query").get(getSingleBook)
router.route("/").post(upload.single('img'),pubLishBook);
router.route("/create-payment-intent").post(paymentsNow)
router.route("/singleProducts").get(getBookStore)
module.exports = router;