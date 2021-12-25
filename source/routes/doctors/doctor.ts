import express from 'express';
import controller from '../../controllers/doctors/doctor';
import extractJWT from '../../middleware/extractJWT';
import isHospital from '../../middleware/isHospital';
import isHospitalOrNurse from '../../middleware/isHospitalOrNurse';
import upload from '../../functions/multerCloudinary';

const router = express.Router();

router.get('/', extractJWT,controller.getAllDoctors);
router.get('/:id', extractJWT,controller.getSingleDoctor); 
router.post('/', isHospital, controller.createDoctor);
router.put('/:id',extractJWT, controller.updateDoctor);
router.delete('/:id',isHospital, controller.deleteDoctor);
router.get('/search/:searchedText', extractJWT, controller.searchDoctor);
router.post('/searchHospitalAndDoctor', extractJWT, controller.searchHospitalAndDoctor);
router.get('/searchDoctorBySpeciality/:specialityId', controller.searchDoctorBySpeciality);
router.put('/uploadProfilePicture/:id', upload.single("image"), controller.uploadProfilePic);
router.post('/filter', extractJWT, controller.filterDoctors);
router.get('/searchAll/:searchedText', extractJWT, controller.searchDoctorsOfAllHospitals);

export = router;
