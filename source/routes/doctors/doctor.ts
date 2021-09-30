import express from 'express';
import controller from '../../controllers/doctors/doctor';
import isHospital from '../../middleware/isHospital';
import isHospitalOrNurse from '../../middleware/isHospitalOrNurse';

const router = express.Router();

router.get('/', isHospitalOrNurse,controller.getAllDoctors);
router.get('/:id', isHospital,controller.getSingleDoctor); 
router.post('/', isHospital, controller.createDoctor);
router.put('/:id',isHospital, controller.updateDoctor);
router.delete('/:id',isHospital, controller.deleteDoctor);
router.get('/search/:searchedText', isHospital, controller.searchDoctor);

export = router;
