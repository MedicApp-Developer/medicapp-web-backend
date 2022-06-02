import express from 'express';
import controller from '../controllers/family';
import extractJWT from '../middleware/extractJWT';

const router = express.Router();

router.post('/', extractJWT, controller.createFamilyMember);
router.delete('/:id', extractJWT, controller.deleteFamilyMember);

export = router;
