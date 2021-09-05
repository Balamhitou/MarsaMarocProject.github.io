const express = require('express');
const router = express.Router();
const userModel = require('../server/models/User');
const authenticate=require("../server/middelware/token_validation");
const imageUp = require('../server/models/imageUpload');
let multer=require('multer');
const storage=multer.diskStorage({
    destination:(req,file,callback)=>{
        callback(null,'uploads')
    },
    filename:(req,file,callback)=>{
        callback(null,`profilePic_${file.originalname}`)
    }
})
var upload=multer({storage})
router.post('/signup', userModel.signup);
router.post('/login', userModel.login);
router.get('/signout',authenticate,userModel.logout);
router.post('/fileUpload',upload.single('file'),imageUp.imageUpload);

module.exports = router;