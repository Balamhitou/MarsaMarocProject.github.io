const express = require('express');
const router = express.Router();
const staticsModel=require('../server/models/statistics');
const authenticate = require('../server/middelware/token_validation');


router.post('/GlobalImport',staticsModel.GlobalImport);
router.post('/GlobalExport',staticsModel.GlobalExport);
router.post('/ExportClientAnnuel',staticsModel.ExportClientAnnuel);
router.post('/ImportClientAnnuel',staticsModel.ImportClientAnnuel);
router.post('/ExportClient',staticsModel.ExportClient);//done
router.post('/ImportClient',staticsModel.ImportClient);//done
router.post('/sejour',staticsModel.delaiSejour);
router.post('/Statisticsliberation',staticsModel.Liberation);
router.post('/StatisticsAvaries',staticsModel.Avaries);
router.post('/StatisticsManquants',staticsModel.Manquants);
router.post('/StatisticSVA',staticsModel.Service);
router.post('/tableau',staticsModel.Tableau);
router.post('/DiagrammeRO',staticsModel.DiagrammeRO);
router.get('/toutesVoitures',staticsModel.TouteVoitures);//done
router.get('/TsVoituresparMarqe',staticsModel.VoituresParMarque);
router.get('/ImportMoisAvant',staticsModel.ImportMoisAvant);//done
router.get('/ExportMoisAvant',staticsModel.ExportMoisAvant);//done
router.get('/SVAChaqueJour',staticsModel.SvaChaqueJour);//done
module.exports = router; 