import express from 'express';
import controller from '../../controllers/hospitals/hospital';
import extractJWT from '../../middleware/extractJWT';
import upload from '../../functions/multerCloudinary';

const router = express.Router();

router.get('/', extractJWT, controller.getAllHospitals);
router.get('/:id', extractJWT, controller.getSingleHospital);
router.get('/details/:id', extractJWT, controller.getHospitalDetail);
router.post('/', controller.createHospital);
router.put('/:id', extractJWT, controller.updateHospital);
router.delete('/:id', extractJWT, controller.deleteHospital);
router.get('/search/:searchedText', extractJWT, controller.searchHospital);
router.put('/uploadImage/:id', upload.single("image"), controller.uploadHospitalImages);
router.post('/filter', extractJWT, controller.filterHospital);
router.get('/doctors/:hospitalId', extractJWT, controller.getHospitalDoctors);
router.get('/finance/:hospitalId', extractJWT, controller.getHospitalFinanceData);
router.post('/finance/report', extractJWT, controller.getHospitalFinanceReport);

export = router;
