import express from 'express'
import controller from '../../controllers/doctors/speciality'
import extractJWT from '../../middleware/extractJWT'
import config from '../../config/config'
import upload from '../../functions/multerCloudinary'

const router = express.Router()

router.get('/', controller.getAllSpeciality)
router.get('/:id', extractJWT, controller.getSingleSpeciality)
router.post('/', upload.single("image"), controller.createSpeciality)
router.put('/:id', upload.single("image"), extractJWT, controller.updateSpeciality)
router.delete('/:id', extractJWT, controller.deleteSpeciality)

export = router
