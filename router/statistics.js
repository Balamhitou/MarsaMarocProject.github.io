const express = require('express');
const router = express.Router();
const staticsModel=require('../server/models/statistics');
const authenticate = require('../server/middelware/token_validation');


router.post('/GlobalImport',authenticate,staticsModel.GlobalImport);//done
router.post('/GlobalExport',authenticate,staticsModel.GlobalExport);//done
router.post('/ExportClientAnnuel',authenticate,staticsModel.ExportClientAnnuel);//done
router.post('/ImportClientAnnuel',authenticate,staticsModel.ImportClientAnnuel);//done
router.post('/ExportClient',authenticate,staticsModel.ExportClient);//done
router.post('/ImportClient',authenticate,staticsModel.ImportClient);//done
router.post('/sejour',authenticate,staticsModel.delaiSejour);//done
router.post('/Statisticsliberation',authenticate,staticsModel.Liberation);//done
router.post('/StatisticsAvaries',authenticate,staticsModel.Avaries);//done
router.post('/StatisticsManquants',authenticate,staticsModel.Manquants);//done
router.post('/StatisticSVA',authenticate,staticsModel.Service);//done
router.post('/tableau',authenticate,staticsModel.Tableau);
router.post('/DiagrammeRO',authenticate,staticsModel.DiagrammeRO);
router.get('/toutesVoitures',authenticate,staticsModel.TouteVoitures);//done
router.get('/TsVoituresparMarqe',authenticate,staticsModel.VoituresParMarque);
router.get('/ImportMoisAvant',authenticate,staticsModel.ImportMoisAvant);//done
router.get('/ExportMoisAvant',authenticate,staticsModel.ExportMoisAvant);//done
router.get('/SVAChaqueJour',authenticate,staticsModel.SvaChaqueJour);//done
module.exports = router; 