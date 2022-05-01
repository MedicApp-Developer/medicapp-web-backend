import express from 'express';
import controller from '../../controllers/hospitals/hospital';
import extractJWT from '../../middleware/extractJWT';
import upload from '../../functions/multerCloudinary';

const router = express.Router();

router.get('/', controller.getAllHospitals);
router.get('/:id', controller.getSingleHospital);
router.get('/details/:id', controller.getHospitalDetail);
router.post('/', upload.single("tradeLicenseFile"), controller.createHospital);
router.put('/:id', extractJWT, controller.updateHospital);
router.delete('/:id', extractJWT, controller.deleteHospital);
router.get('/search/:searchedText', controller.searchHospital);
router.put('/uploadImage/:id', upload.single("image"), controller.uploadHospitalImages);
router.post('/filter', controller.filterHospital);
router.get('/doctors/:hospitalId', controller.getHospitalDoctors);
router.get('/finance/:hospitalId', extractJWT, controller.getHospitalFinanceData);
router.post('/finance/report', extractJWT, controller.getHospitalFinanceReport);
router.post('/finance/statistics', extractJWT, controller.getHospitalFinanceStatistics);
router.post('/finance/pcr/report', extractJWT, controller.getMedicappPCRFinanceReport);
router.post('/finance/pcr/statistics', extractJWT, controller.getMedicappPCRFinanceStatistics);
router.get('/get/pending', controller.getPendingHospitals);
router.put('/approveHospital/:id', extractJWT, controller.approveHospital);
router.get('/getTradeLicenseFile/:id', extractJWT, controller.getTradeLicenseFile);
router.put('/uploadProfilePicture/:id', upload.single("image"), controller.uploadProfilePic);

export = router;
