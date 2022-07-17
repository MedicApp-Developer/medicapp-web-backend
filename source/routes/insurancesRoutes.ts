import express from 'express'
import controller from '../controllers/insurance'
import extractJWT from '../middleware/extractJWT'
import config from '../config/config'
import upload from '../functions/multerCloudinary'

const router = express.Router()

router.get('/', controller.getAllInsurances)
router.get('/:id', extractJWT, controller.getSingleInsurance)
router.post('/', upload.single("image"), controller.createInsurance)
router.put('/:id', upload.single("image"), extractJWT, controller.updateInsurance)
router.delete('/:id', extractJWT, controller.deleteInsurance)

export = router
