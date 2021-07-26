const express = require('express');
const router = express.Router();
const crudModel = require('../server/models/crud');
const authenticate = require('../server/middelware/token_validation');

router.post('/AddVoiture',crudModel.CreateVoiture);
router.post('/libereVoiture',crudModel.liberationVoiture);
router.post('/Toservice',crudModel.Service);
module.exports = router;