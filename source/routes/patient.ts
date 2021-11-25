import express from 'express';
import controller from '../controllers/patient';
import extractJWT from '../middleware/extractJWT';
import upload from '../functions/fileUpload';
import isHospitalOrNurse from '../middleware/isHospitalOrNurse';
import isHospital from '../middleware/isHospital';
import isNurse from '../middleware/isNurse';

const router = express.Router();

router.get('/', extractJWT,controller.getAllPatients);
router.get('/:id', extractJWT,controller.getSinglePatient);
router.get('/profile/:id', extractJWT,controller.getPatientAccountInfo);
router.post('/', controller.createPatient);
router.put('/:id',isHospitalOrNurse, controller.updatePatient);
router.delete('/:id',isHospitalOrNurse, controller.deletePatient);
router.post('/createNursePatient', isNurse, controller.createPatientFromNurse);

export = router;
