import express from 'express';
import controller from '../../controllers/vendors/package';
import extractJWT from '../../middleware/extractJWT';

const router = express.Router();

router.post('/', controller.createPackage);
router.get('/', extractJWT, controller.getAllPackages);
router.get('/:id', extractJWT, controller.getSinglePackage);
router.get('/vendor/:vendorId', extractJWT, controller.getVendorPackages);
router.delete('/:id', extractJWT, controller.deletePackage);
router.put('/:id', extractJWT, controller.updatePackage);

export = router;
