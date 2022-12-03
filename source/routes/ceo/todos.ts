import express from 'express'
import controller from '../../controllers/ceo/todos'
import extractJWT from '../../middleware/extractJWT'

const router = express.Router()


router.post('/', extractJWT, controller.createTodo)
router.get('/:date', extractJWT, controller.getDateTodos)
router.get('/', extractJWT, controller.getTodos)


// router.delete('/delete/:id', extractJWT, controller.deleteDoctorSlot);

export = router
