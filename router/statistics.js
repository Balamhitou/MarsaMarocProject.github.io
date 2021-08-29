const express = require('express');
const router = express.Router();
const staticsModel=require('../server/models/statistics');
const authenticate = require('../server/middelware/token_validation');


router.post('/GlobalImport',staticsModel.GlobalImport);
router.post('/GlobalExport',staticsModel.GlobalExport);
router.post('/ExportClient',staticsModel.ExportClient);
router.post('/ImportClient',staticsModel.ImportClient);
router.post('/sejour',staticsModel.delaiSejour);
router.post('/Statisticsliberation',staticsModel.Liberation);
router.post('/StatisticsAvaries',staticsModel.Avaries);
router.post('/StatisticsManquants',staticsModel.Manquants);
router.post('/StatisticSVA',staticsModel.Service);
router.post('/tableau',staticsModel.Tableau);
router.post('/DiagrammeRO',staticsModel.DiagrammeRO);
router.post('/toutesVoitures',staticsModel.TouteVoitures);
router.post('/TsVoituresparMarqe',staticsModel.VoituresParMarque);
router.post('/ImportMoisAvant',staticsModel.ImportMoisAvant);
router.post('/ExportMoisAvant',staticsModel.ExportMoisAvant);
router.post('/SVAChaqueJour',staticsModel.SvaChaqueJour);
module.exports = router; 