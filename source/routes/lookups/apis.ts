import express from 'express'
import controller from '../../controllers/lookups/apis'

const router = express.Router()

router.get('/countries', controller.getCountries)
router.get('/genders', controller.getGenders)
router.get('/languages', controller.getLanguages)

export = router
