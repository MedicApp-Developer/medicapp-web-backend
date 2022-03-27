import express from 'express';
import controller from '../controllers/pointsCode';
import extractJWT from '../middleware/extractJWT';

const router = express.Router();

router.get('/getHospitalCodes/:hospitalId', extractJWT, controller.getHospitalPointsCode);
router.get('/getPatientCodes/:patientId', extractJWT, controller.getPatientPointsCode);
router.post('/verifyCode', extractJWT, controller.verifyCode);

export = router;
