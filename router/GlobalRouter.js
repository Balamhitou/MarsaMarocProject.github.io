const express = require('express');
const router = express.Router();
const crudModel = require('../server/models/Global');
const authenticate = require('../server/middelware/token_validation');

//router.post('/AddVoiture',crudModel.CreateVoiture);
router.post('/libereVoitures',crudModel.liberationVoiture);
router.post('/Toservice',crudModel.Service);
router.get('/getVoiture/:VIN' ,crudModel.getAll);
router.post('/getPlace',crudModel.getPlace);
router.post('/reservation' ,crudModel.Reservation);
router.post('/LibererUneVoiture',crudModel.dateEssaie);
router.post('/verificationSortie',crudModel.PointageSortie);
router.post('/escale',crudModel.CreationEscale);
router.get('/EscaleCrees',crudModel.TabEscale);
router.post('/affectIdEscale',crudModel.AffectIdEscale);
router.get('/AllPlaces/:Niveau',crudModel.AllPlaces);


module.exports = router;