import express from 'express';
import controller from '../../controllers/pharmacy/branch';
import extractJWT from '../../middleware/extractJWT';
import isPharmacy from '../../middleware/isPharmacy';

const router = express.Router();

router.get('/:pharmacyId', extractJWT,controller.getAllBranchesOfPharmacy);
router.get('/:branchId', extractJWT,controller.getSingleBranch); 
router.post('/', [ isPharmacy ], controller.createBranch);
router.put('/:id',extractJWT, controller.updateBranch);
router.delete('/:id',extractJWT, controller.deleteBranch);
router.get('/search/:searchedText', extractJWT, controller.searchBranch);

export = router;
