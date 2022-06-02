import express from 'express';
import controller from '../../controllers/pharmacy/pharmacy';
import extractJWT from '../../middleware/extractJWT';
import upload from '../../functions/fileUpload';

const router = express.Router();

router.get('/', extractJWT,controller.getAllPharmacies);
router.get('/:id', extractJWT,controller.getSinglePharmacy); 
router.post('/', [ upload.single("tradeLicenseFile") ], controller.createPharmacy);
router.put('/:id',extractJWT, controller.updatePharmacy);
router.delete('/:id',extractJWT, controller.deletePharmacy);
router.get('/search/:searchedText', extractJWT, controller.searchPharmacy);

export = router;
