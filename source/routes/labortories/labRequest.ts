import express from 'express';
import controller from '../../controllers/labortories/labRequest';
import extractJWT from '../../middleware/extractJWT';

const router = express.Router();
 
router.post('/', extractJWT, controller.createLabRequest);
router.get('/:doctorId', extractJWT, controller.getLabRequests);
router.put('/:labRequest', extractJWT, controller.updateLabRequest);

export = router;
