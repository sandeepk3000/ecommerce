const express = require("express")
const router = express.Router();
const { addReviews, getProduts, addProduct, getSingleProduts, getReviews, createPayment, orderController, deliveryController, boyController, otpGenerater, otpVerify } = require("../controllers/operationOnStore");
const upload = require("../controllers/book.uploader");
router.route("/").get(getProduts);
router.route("/deliveryBoy-controller").get(boyController)
router.route("/order-controller").get(orderController)
router.route("/delivery-controller").get(deliveryController)
router.route("/addReviews").patch(addReviews)
// router.route("/").post(upload.single('image'),addProduct);
router.route("/create-payment").post(createPayment)
router.route("/order-controller").post(orderController)
router.route("/delivery-controller").post(deliveryController)
router.route("/delivery-controller").patch(deliveryController)
router.route("/generate-otp").post(otpGenerater)
router.route("/verify-otp").post(otpVerify)
router.route("/:query").get(getSingleProduts)
router.route("/singleProducts/:query").get(getProduts)
router.route("/getReviews/:query").get(getReviews)



module.exports = router;