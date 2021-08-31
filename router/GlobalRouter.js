const express = require('express');
const router = express.Router();
const crudModel = require('../server/models/Global');
const excelFile=require('../server/excel');
const authenticate = require('../server/middelware/token_validation');
const multer=require('multer');
const fileStorageEngine =multer.diskStorage({
    destination :(req,file,cb)=>{
        cb(null,"")
    },
    filename: (req, file, cb)=>{
        cb(null, file.originalname)
    }
});
const upload=multer({storage: fileStorageEngine });

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
router.post('/file',upload.single('filexlsx'),excelFile.readFile);


module.exports = router;