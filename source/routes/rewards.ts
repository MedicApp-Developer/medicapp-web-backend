import express from 'express';
import controller from '../controllers/rewards';
import extractJWT from '../middleware/extractJWT';

const router = express.Router();

router.post('/', controller.subscribePackage);
router.put('/:id', extractJWT, controller.approvePackage);
router.get('/:patientId', extractJWT, controller.getAllPatientRewards);
router.get('/', controller.getPatientRewardsHomeData);
router.get('/vendor/:vendorId', extractJWT, controller.getAllVendorRewards);

export = router;
