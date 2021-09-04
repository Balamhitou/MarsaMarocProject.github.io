const express = require('express');
const router = express.Router();
const authenticate = require('../server/middelware/token_validation');

const avaries = require('../server/models/sinistralités');
router.post('/avaries',authenticate,avaries.Sinistralités);
router.post('/manquant',authenticate,avaries.Manquants);
module.exports = router;