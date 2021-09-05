const express = require('express');
const router = express.Router();
const crudModel = require('../server/models/Global');
const excelFile=require('../server/excel');
const authenticate = require('../server/middelware/token_validation');
const multer=require('multer');
const { route } = require('./auth');
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
router.post('/libereVoitures',authenticate,crudModel.liberationVoiture);//done
router.post('/Toservice',authenticate,crudModel.Service);//done

router.get('/getVoiture/:VIN' ,authenticate,crudModel.getAll);
router.post('/getPlace',authenticate,crudModel.getPlace);
router.post('/reservation' ,authenticate,crudModel.Reservation);//done
router.post('/LibererUneVoiture',authenticate,crudModel.dateEssaie);//done
router.post('/verificationSortie',authenticate,crudModel.PointageSortie);
router.post('/escale',authenticate,crudModel.CreationEscale);
router.get('/EscaleCrees',crudModel.TabEscale);//done
router.get('/AllPlaces/:Niveau',authenticate,crudModel.AllPlaces);//done
router.post('/file',authenticate,upload.single('filexlsx'),excelFile.readFile);//done


module.exports = router;