import express from 'express';
import controller from '../../controllers/doctors/doctor';
import extractJWT from '../../middleware/extractJWT';
import isHospital from '../../middleware/isHospital';
import isHospitalOrNurse from '../../middleware/isHospitalOrNurse';

const router = express.Router();

router.get('/', isHospitalOrNurse,controller.getAllDoctors);
router.get('/:id', extractJWT,controller.getSingleDoctor); 
router.post('/', isHospital, controller.createDoctor);
router.put('/:id',extractJWT, controller.updateDoctor);
router.delete('/:id',isHospital, controller.deleteDoctor);
router.get('/search/:searchedText', isHospital, controller.searchDoctor);

export = router;
