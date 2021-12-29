import express from 'express';
import controller from '../../controllers/doctors/slot';
import extractJWT from '../../middleware/extractJWT';

const router = express.Router();

router.post('/', extractJWT, controller.createSlot);
router.post('/all/doctor/:doctorId', extractJWT, controller.getDoctorAllSlots);
router.post('/available/doctor/:doctorId', extractJWT, controller.getDoctorAvailableSlots);
router.post('/booked/doctor/:doctorId', extractJWT, controller.getDoctorBookedSlots);
router.post('/PCRTests/hospital/:hospitalId', extractJWT, controller.getHospitalPCRTestSlots);
router.post('/PCRVaccination/hospital/:hospitalId', extractJWT, controller.getHospitalPCRVaccinationSlots);

export = router;
