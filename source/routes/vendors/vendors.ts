import express from 'express';
import controller from '../../controllers/vendors/vendors';
import extractJWT from '../../middleware/extractJWT';
import upload from '../../functions/multerCloudinary';

const router = express.Router();

router.post('/', controller.registerVendor);
router.get('/', extractJWT, controller.getAllVendors);
router.get('/:id', extractJWT, controller.getSingleVendors);
router.delete('/:id', extractJWT, controller.deleteVendor);
router.put('/:id', extractJWT, controller.updateVendor);
router.put('/uploadImage/:id', upload.single("image"), controller.uploadVendorImages);

export = router;
