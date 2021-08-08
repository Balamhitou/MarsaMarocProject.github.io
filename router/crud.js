const express = require('express');
const router = express.Router();
const crudModel = require('../server/models/crud');
const authenticate = require('../server/middelware/token_validation');

router.post('/AddVoiture',crudModel.CreateVoiture);
router.post('/libereVoitures',crudModel.liberationVoiture);
router.post('/libereUneVoiture',crudModel.libererUneVoiture);
router.post('/Toservice',crudModel.Service);
router.get('/getVoiture/:VIN',crudModel.getAll);
router.post('/getPlace',crudModel.getPlace);
router.post('/reservation',crudModel.Reservation);
router.post('/essaie',crudModel.dateEssaie);

module.exports = router;