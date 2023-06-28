const multer = require("multer");
 
const storage = multer.diskStorage({
    destination:function(req,file,cd){
        console.log(file);
        cd(null,'../public/products_img/');
    },
    filename:function(req,file,cd){
        cd(null,file.originalname)
    }
})

const upload = multer({
    storage:storage
})

module.exports = upload;