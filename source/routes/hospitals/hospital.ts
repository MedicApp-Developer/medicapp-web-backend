import express from 'express';
import controller from '../../controllers/hospitals/hospital';
import extractJWT from '../../middleware/extractJWT';
import upload from '../../functions/fileUpload';

const router = express.Router();

router.get('/', extractJWT,controller.getAllHospitals);
router.get('/:id', extractJWT,controller.getSingleHospital); 
router.get('/details/:id', extractJWT,controller.getHospitalDetail); 
router.post('/', controller.createHospital);
router.put('/:id',extractJWT, controller.updateHospital);
router.delete('/:id',extractJWT, controller.deleteHospital);
router.get('/search/:searchedText', extractJWT, controller.searchHospital);
router.put('/uploadImage/:id', extractJWT, controller.uploadHospitalImages);
router.post('/filter', extractJWT, controller.filterHospital);

export = router;
