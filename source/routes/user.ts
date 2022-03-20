import express from 'express';
import controller from '../controllers/user';
import extractJWT from '../middleware/extractJWT';

const router = express.Router();

router.get('/validate', extractJWT, controller.validateToken);
router.post('/register-admin', controller.register);
router.post('/login', controller.login);
router.get('/get/all', extractJWT, controller.getAllUsers);
router.delete('/delete/:id', extractJWT, controller.deleteUser);
router.put('/forget-password', controller.forgetPassword);
router.put('/reset-password', controller.resetPassword);
router.get('/:id', controller.getSingleUser);

export = router;
