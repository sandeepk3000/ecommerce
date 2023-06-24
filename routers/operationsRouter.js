const express = require("express")
const router = express.Router();
const {pubLishBook,getBookStore,getSingleBook,likeAndDisLikeOnProducts}= require("../controllers/operation")
router.route("/").get(getBookStore);
router.route("/:query").get(getSingleBook)
// router.route("/login").post(loginOnBookStore);
router.route("/:query").patch(likeAndDisLikeOnProducts);
router.route("/").post(pubLishBook);
module.exports = router;