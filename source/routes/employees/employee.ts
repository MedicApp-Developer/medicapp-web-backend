import express from 'express';
import controller from '../../controllers/employees/employee';
import extractJWT from '../../middleware/extractJWT';
import isCEO from '../../middleware/isCEO';
import upload from '../../functions/multerCloudinary';

const router = express.Router();

router.get('/', extractJWT, controller.getAllEmployees);
router.post('/getAllEmployeesWithDepartment', extractJWT, controller.getAllEmployeesWithDepartment);
router.get('/:id', controller.getSingleEmployee);
router.post('/', [isCEO, upload.fields([
  { name: 'employeeAgreement', maxCount: 1 },
  { name: 'passportPdf', maxCount: 1 },
  { name: 'emiratesIdPdf', maxCount: 1 },
  { name: 'visaPdf', maxCount: 1 },
  { name: 'profilePic', maxCount: 1 },
])], controller.createEmployee);
router.put('/:id', [isCEO, upload.fields([
  { name: 'employeeAgreement', maxCount: 1 },
  { name: 'passportPdf', maxCount: 1 },
  { name: 'emiratesIdPdf', maxCount: 1 },
  { name: 'visaPdf', maxCount: 1 },
  { name: 'profilePic', maxCount: 1 },
])], controller.updateEmployee);
router.delete('/:id', isCEO, controller.deleteEmployee);
router.get('/search/:searchedText', controller.searchEmployee);

export = router;
