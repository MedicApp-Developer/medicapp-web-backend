import express from 'express'
import controller from '../controllers/leaves'
import extractJWT from '../middleware/extractJWT'

const router = express.Router()

router.post('/', extractJWT, controller.createLeave)
router.get('/getSickLeaves/:id', extractJWT, controller.getSickLeaves)
router.get('/downloadSickLeave/:id', extractJWT, controller.downloadSickLeave)

export = router
