import express from 'express';
import controller from '../controllers/role';
import extractJWT from '../middleware/extractJWT';

const router = express.Router();

router.get('/', extractJWT,controller.getAllRoles);
router.get('/:id', extractJWT,controller.getSingleRole);
router.post('/',extractJWT, controller.createRole);
router.put('/:id',extractJWT, controller.updateRole);
router.delete('/:id',extractJWT, controller.deleteRole);

export = router;
