import express from 'express';
import controller from '../../controllers/vendors/packageCategory';
import extractJWT from '../../middleware/extractJWT';
import upload from '../../functions/multerCloudinary';

const router = express.Router();

router.get('/', controller.getAllPackageCategories);
router.get('/:id', controller.getSinglePackageCategory);
router.post('/', upload.single("image"), controller.createPackageCategory);
router.put('/:id', upload.single("image"), controller.updatePackageCategory);
router.delete('/:id', extractJWT, controller.deletePackageCategory);

export = router;
