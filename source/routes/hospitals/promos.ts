import express from 'express';
import controller from '../../controllers/hospitals/promos';
import isHospital from '../../middleware/isHospital';
import upload from '../../functions/multerCloudinary';

const router = express.Router();

router.get('/', isHospital, controller.getAllPromos);
router.get('/all', isHospital, controller.getAllPromoVideos);
router.post('/', isHospital, upload.single("video"), controller.createPromo);
router.delete('/:id', isHospital, controller.deletePromo);

export = router;
