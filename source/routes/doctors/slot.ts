import express from 'express'
import controller from '../../controllers/doctors/slot'
import extractJWT from '../../middleware/extractJWT'

const router = express.Router()

router.post('/', extractJWT, controller.createSlot)
router.post('/all/doctor/:doctorId', controller.getDoctorAllSlots)
router.get('/approved/doctor/:doctorId', extractJWT, controller.getDoctorApprovedSlots)
router.post('/available/doctor/:doctorId', extractJWT, controller.getDoctorAvailableSlots)
router.post('/booked/doctor/:doctorId', extractJWT, controller.getDoctorBookedSlots)
router.post('/PCRTests/hospital/:hospitalId', extractJWT, controller.getHospitalPCRTestSlots)
router.post('/PCRVaccination/hospital/:hospitalId', extractJWT, controller.getHospitalPCRVaccinationSlots)
router.get('/appointmentSlip/:id', extractJWT, controller.getAppointmentSlip)
router.post('/medicapp', extractJWT, controller.createMedicappSlot);
router.post('/patient/booked/:patientId', extractJWT, controller.getPatientMedicappBookedSlots);
router.delete('/medicapp/:id', extractJWT, controller.cancelMedicappAppointment);
router.delete('/delete/:id', extractJWT, controller.deleteDoctorSlot);
router.get('/medicapp', extractJWT, controller.getAllMedicappBookedAppointments);

export = router
