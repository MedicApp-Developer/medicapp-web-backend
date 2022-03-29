import express from 'express'
import controller from '../controllers/home'
import extractJWT from '../middleware/extractJWT'

const router = express.Router()

router.post('/', extractJWT, controller.getHomeData)
router.get('/filters', controller.getFilters)

export = router
