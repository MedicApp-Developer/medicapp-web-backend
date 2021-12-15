import express from 'express';
import controller from '../../controllers/doctors/slot';
import extractJWT from '../../middleware/extractJWT';

const router = express.Router();

router.post('/', extractJWT, controller.createSlot);

export = router;
