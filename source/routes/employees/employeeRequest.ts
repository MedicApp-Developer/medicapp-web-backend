import express from 'express';
import controller from '../../controllers/employees/employeeRequest';
import extractJWT from '../../middleware/extractJWT';
import upload from '../../functions/multerCloudinary';

const router = express.Router();

router.get('/getAll/:id', controller.getAllRequestsOfEmployee);
router.get('/:id', controller.getSingleRequest);
router.post('/', upload.single("leavePdf"), controller.createEmployeeRequest);
router.put('/:id', extractJWT, controller.updateEmployeeRequest);
router.delete('/:id', extractJWT, controller.deleteEmployeeCategory);

export = router;
