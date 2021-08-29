const express = require('express');
const router = express.Router();
const authenticate = require('../server/middelware/token_validation');

const avaries = require('../server/models/sinistralités');
router.post('/avaries',avaries.Sinistralités);
router.post('/manquant',avaries.Manquants);
module.exports = router;