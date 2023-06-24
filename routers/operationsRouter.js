const express = require("express")
const router = express.Router();
const {getBookStore,getSingleBook,pubLishBook,likeAndDisLikeOnProducts}= require("../controllers/operation");
const upload = require("../controllers/publish.book");
router.route("/").get(getBookStore);
router.route("/:query").get(getSingleBook)
// router.route("/login").post(loginOnBookStore);
router.route("/:query").patch(likeAndDisLikeOnProducts);
router.route("/").post(upload.single('img'),pubLishBook);
module.exports = router;