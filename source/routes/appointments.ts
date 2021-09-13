import express from 'express';
import controller from '../controllers/appointments';
import extractJWT from '../middleware/extractJWT';

const router = express.Router();

router.get('/', extractJWT,controller.getAllAppointments);
router.get('/:id', extractJWT,controller.getSingleAppointment);
router.post('/', controller.createAppointment);
router.put('/:id',extractJWT, controller.updateAppointment);
router.delete('/:id',extractJWT, controller.deleteAppointment);

// Get todays appointments

export = router;
