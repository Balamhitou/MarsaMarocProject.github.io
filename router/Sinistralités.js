const express = require('express');
const router = express.Router();

const avaries = require('../server/models/sinistralités');
router.post('/avaries',avaries.Sinistralités);
router.post('/manquant',avaries.Manquants);
module.exports = router;