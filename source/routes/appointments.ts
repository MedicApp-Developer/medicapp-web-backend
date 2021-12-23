import express from 'express';
import controller from '../controllers/appointments';
import extractJWT from '../middleware/extractJWT';
import isHospital from '../middleware/isHospital';
import isHospitalOrDoctor from '../middleware/isHospitalOrDoctor';

const router = express.Router();

router.get('/', extractJWT,controller.getAllAppointments);
router.get('/:id', extractJWT,controller.getSingleAppointment);
router.post('/', extractJWT, controller.createAppointment);
router.delete('/cancel/:slotId', extractJWT, controller.cancelAppointment);
router.put('/:id',extractJWT, controller.updateAppointment);
router.delete('/:id',extractJWT, controller.deleteAppointment);
router.delete('/:id/:patientId',extractJWT, controller.deletePatientAppointment);
router.get('/hospitalAppointments/:hospitalId', isHospital, controller.getHospitalAppointments)
router.get('/doctorAppointments/:doctorId', isHospitalOrDoctor, controller.getDoctorAppointments);
// Get todays appointments

export = router;
