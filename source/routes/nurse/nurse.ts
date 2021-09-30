import express from 'express';
import controller from '../../controllers/nurse/nurse';
import isHospital from '../../middleware/isHospital';
import isHospitalOrNurse from '../../middleware/isHospitalOrNurse';

const router = express.Router();

router.get('/', isHospital,controller.getAllNurses);
router.get('/:id', isHospitalOrNurse,controller.getSingleNurse); 
router.post('/', isHospital, controller.createNurse);
router.put('/:id',isHospitalOrNurse, controller.updateNurse);
router.delete('/:id',isHospital, controller.deleteNurse);
router.get('/search/:searchedText', isHospital, controller.searchNurse);

export = router;
