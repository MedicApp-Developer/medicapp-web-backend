import express from 'express';
import controller from '../../controllers/hospitals/promos';
import isHospital from '../../middleware/isHospital';

const router = express.Router();

router.get('/',isHospital, controller.getAllPromos);
router.post('/', isHospital, controller.createPromo);
router.delete('/:id',isHospital, controller.deletePromo);

export = router;
