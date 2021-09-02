const express = require('express');
const router = express.Router();
const staticsModel=require('../server/models/statistics');
const authenticate = require('../server/middelware/token_validation');


router.post('/GlobalImport',staticsModel.GlobalImport);//done
router.post('/GlobalExport',staticsModel.GlobalExport);//done
router.post('/ExportClientAnnuel',staticsModel.ExportClientAnnuel);//done
router.post('/ImportClientAnnuel',staticsModel.ImportClientAnnuel);//done
router.post('/ExportClient',staticsModel.ExportClient);//done
router.post('/ImportClient',staticsModel.ImportClient);//done
router.post('/sejour',staticsModel.delaiSejour);//done
router.post('/Statisticsliberation',staticsModel.Liberation);//done
router.post('/StatisticsAvaries',staticsModel.Avaries);//done
router.post('/StatisticsManquants',staticsModel.Manquants);//done
router.post('/StatisticSVA',staticsModel.Service);//done
router.post('/tableau',staticsModel.Tableau);
router.post('/DiagrammeRO',staticsModel.DiagrammeRO);
router.get('/toutesVoitures',staticsModel.TouteVoitures);//done
router.get('/TsVoituresparMarqe',staticsModel.VoituresParMarque);
router.get('/ImportMoisAvant',staticsModel.ImportMoisAvant);//done
router.get('/ExportMoisAvant',staticsModel.ExportMoisAvant);//done
router.get('/SVAChaqueJour',staticsModel.SvaChaqueJour);//done
module.exports = router; 