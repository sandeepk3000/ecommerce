const express = require("express")
const router = express.Router();
const {myCart,signUp,getUser, login, changeUserInfo, getPage}=require("../controllers/account.controllers")
router.route("/signup").post(signUp);
router.route("/login").post(login)
router.route("/changeUserInfo").patch(changeUserInfo)
router.route("/page").get(getPage)
// router.route("/:query").patch(likeAndDisLikeOnProducts);
router.route("/onCart/:query").patch(myCart)
router.route("/onCart/:query").get(myCart)
router.route("/:query").get(getUser)

module.exports=router;