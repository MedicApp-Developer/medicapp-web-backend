import express from 'express';
import controller from '../controllers/bookmarks';
import extractJWT from '../middleware/extractJWT';

const router = express.Router();

router.post('/', extractJWT,controller.createBookmark);

export = router;
