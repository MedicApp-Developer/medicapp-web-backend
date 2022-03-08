import express from 'express';
import controller from '../../controllers/vendors/vendors';
import extractJWT from '../../middleware/extractJWT';

const router = express.Router();

router.post('/', controller.registerVendor);
router.get('/', extractJWT, controller.getAllVendors);
router.delete('/:id', extractJWT, controller.deleteVendor);
router.put('/:id', extractJWT, controller.updateVendor);

export = router;
