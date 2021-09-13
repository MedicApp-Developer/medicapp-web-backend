import express from 'express';
import controller from '../../controllers/nurse/nurse';
import isHospital from '../../middleware/isHospital';

const router = express.Router();

router.get('/', isHospital,controller.getAllNurses);
router.get('/:id', isHospital,controller.getSingleNurse); 
router.post('/', isHospital, controller.createNurse);
router.put('/:id',isHospital, controller.updateNurse);
router.delete('/:id',isHospital, controller.deleteNurse);
router.get('/search/:searchedText', isHospital, controller.searchNurse);

export = router;
