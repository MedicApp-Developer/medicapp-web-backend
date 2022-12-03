import express from 'express';
import controller from '../../controllers/employees/checkin';
import extractJWT from '../../middleware/extractJWT';

const router = express.Router();

router.post('/in', extractJWT, controller.employeeCheckin);
router.put('/out/:id', extractJWT, controller.updateCheckout);
router.post('/in-out', extractJWT, controller.getSingleCheckinInfoWithDate);
router.get('/recents', controller.getRecentEmployeeAttendance);
router.get('/:employeeId', extractJWT, controller.getEmployeeAttendance);


export = router;
