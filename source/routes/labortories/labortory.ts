import express from 'express';
import controller from '../../controllers/labortories/labortory';
import isHospital from '../../middleware/isHospital';

const router = express.Router();

router.get('/', isHospital,controller.getAllLabortories);
router.get('/:id', isHospital,controller.getSingleLabortory); 
router.post('/', isHospital, controller.createLabortory);
router.put('/:id',isHospital, controller.updateLabortory);
router.delete('/:id',isHospital, controller.deleteLabortory);
router.get('/search/:searchedText', isHospital, controller.searchLabortory);

export = router;
