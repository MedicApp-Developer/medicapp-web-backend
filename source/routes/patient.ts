import express from 'express';
import controller from '../controllers/patient';
import extractJWT from '../middleware/extractJWT';
import isHospitalOrNurse from '../middleware/isHospitalOrNurse';
import isHospital from '../middleware/isHospital';
import isPatient from '../middleware/isPatient';
import isNurse from '../middleware/isNurse';
import upload from '../functions/multerCloudinary';

const router = express.Router();

router.get('/', extractJWT,controller.getAllPatients);
router.get('/:id', extractJWT,controller.getSinglePatient);
router.get('/profile/:id', extractJWT,controller.getPatientAccountInfo);
router.post('/', controller.createPatient);
router.put('/webfcToken', controller.updateWebFcToken);
router.put('/mobilefcToken', controller.updateMobileFcToken);

router.put('/:id', extractJWT, controller.updatePatient);
router.delete('/:id', isHospitalOrNurse, controller.deletePatient);
router.delete('/deactivateUser/:id', isPatient, controller.deactivePatient); //deactive user by Umair
router.post('/createNursePatient', isNurse, controller.createPatientFromNurse);
router.get('/labResults/:id', extractJWT, controller.getLabResults);
router.get('/qrPrescriptions/:id', extractJWT, controller.getQRPrescription);
router.put('/uploadProfilePicture/:id', upload.single("image"), controller.uploadProfilePic);
router.delete('/deleteProfileImage/:patientId', controller.deleteProfileImage);


export = router;
