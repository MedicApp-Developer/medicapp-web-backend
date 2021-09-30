import express from 'express';
import controller from '../../controllers/hospitals/services';
import extractJWT from '../../middleware/extractJWT';

const router = express.Router();

router.get('/all', controller.getAllServices);
router.get('/:id', extractJWT,controller.getSingleService);
router.post('/', controller.createService);
router.put('/:id',extractJWT, controller.updateService);
router.delete('/:id',extractJWT, controller.deleteService);

export = router;
