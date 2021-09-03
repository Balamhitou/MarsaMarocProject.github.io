const express = require('express');
const router = express.Router();
const userModel = require('../server/models/User');
const authenticate=require("../server/middelware/token_validation");

router.post('/signup', userModel.signup);
router.post('/login', userModel.login);
router.get('/signout',authenticate,userModel.logout);

module.exports = router;