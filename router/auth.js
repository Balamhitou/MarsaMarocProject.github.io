const express = require('express');
const router = express.Router();
const userModel = require('../server/models/User');

router.post('/signup', userModel.signup);
router.post('/login', userModel.login);

module.exports = router;