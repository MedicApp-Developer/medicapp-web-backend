import express from 'express';
import controller from '../controllers/home';
import extractJWT from '../middleware/extractJWT';

const router = express.Router();

router.get('/', extractJWT,controller.getHomeData);

export = router;
