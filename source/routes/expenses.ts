import express from 'express'
import controller from '../controllers/expenses'
import extractJWT from '../middleware/extractJWT'

const router = express.Router()

router.get('/monthly/expensetype/:month/:year/:type', controller.getMonthlyAllSingleExpensesTypes)
router.get('/monthly/expensetype/:month/:year', controller.getMonthlyAllExpensesTypes)
router.get('/monthly', controller.getMonthlyAllExpenses)
router.post('/', extractJWT, controller.createExpense)
router.get('/', controller.getAllExpenses)
router.put('/', extractJWT, controller.updateExpense )
router.delete('/:id', extractJWT, controller.removeExpense )


export = router
