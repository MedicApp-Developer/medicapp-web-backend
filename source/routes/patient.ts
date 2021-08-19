import express from 'express';
import controller from '../controllers/patient';
import extractJWT from '../middleware/extractJWT';

const router = express.Router();

router.get('/', extractJWT,controller.getAllPatients);
router.get('/:id', extractJWT,controller.getSinglePatient);
router.post('/', controller.createPatient);
router.put('/:id',extractJWT, controller.updatePatient);
router.delete('/:id',extractJWT, controller.deletePatient);

export = router;
