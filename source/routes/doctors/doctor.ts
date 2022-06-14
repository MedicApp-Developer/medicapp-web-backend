import express from 'express';
import controller from '../../controllers/doctors/doctor';
import extractJWT from '../../middleware/extractJWT';
import isHospital from '../../middleware/isHospital';
import isHospitalOrNurse from '../../middleware/isHospitalOrNurse';
import upload from '../../functions/multerCloudinary';

const router = express.Router();

router.get('/', extractJWT, controller.getAllDoctors);
router.get('/all', controller.getAllPatientDoctors);
router.get('/:id', controller.getSingleDoctor);
router.post('/', isHospital, controller.createDoctor);
router.put('/:id', extractJWT, controller.updateDoctor);
router.delete('/:id', isHospital, controller.deleteDoctor);
router.get('/search/:searchedText', controller.searchDoctor);
router.post('/searchHospitalAndDoctor', controller.searchHospitalAndDoctor);
router.get('/searchDoctorBySpeciality/:specialityId', controller.searchDoctorBySpeciality);
router.put('/uploadProfilePicture/:id', upload.single("image"), controller.uploadProfilePic);
router.post('/filter', controller.filterDoctors);
router.get('/searchAll/:searchedText', controller.searchDoctorsOfAllHospitals);
router.delete('/deleteProfileImage/:doctorId', extractJWT, controller.deleteProfileImage);

export = router;
