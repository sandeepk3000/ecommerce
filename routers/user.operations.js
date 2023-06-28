const express = require("express")
const router = express.Router();
const {myCart,loginOnStore,likeAndDisLikeOnProducts,getUser}=require("../controllers/operationByUser")
router.route("/login").post(loginOnStore);
router.route("/:query").patch(likeAndDisLikeOnProducts);
router.route("/onCart/:query").patch(myCart)
router.route("/:query").get(getUser)
module.exports=router;