import express from 'express';
import controller from '../../controllers/vendors/package';
import extractJWT from '../../middleware/extractJWT';
import upload from '../../functions/multerCloudinary';

const router = express.Router();

router.post('/', upload.single("image"), controller.createPackage);
router.get('/', controller.getAllPackages);
router.get('/:id', controller.getSinglePackage);
router.get('/vendor/:vendorId', controller.getVendorPackages);
router.delete('/:id', extractJWT, controller.deletePackage);
router.put('/:id', upload.single("image"), controller.updatePackage);

export = router;
