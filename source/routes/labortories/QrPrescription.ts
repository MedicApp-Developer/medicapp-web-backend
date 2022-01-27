import express from 'express'
import controller from '../../controllers/labortories/QrPrescription'
import extractJWT from '../../middleware/extractJWT'

const router = express.Router()

router.post('/', extractJWT, controller.createQrPrescription)
router.get('/', extractJWT, controller.getQrPrescription)
router.get('/download/:id', extractJWT, controller.getQRPrescriptionSlip)
export = router
