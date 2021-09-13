import express from 'express';
import controller from '../controllers/category';
import extractJWT from '../middleware/extractJWT';

const router = express.Router();

router.get('/', extractJWT,controller.getAllCategories);
router.get('/:id', extractJWT,controller.getSingleCategory);
router.post('/', controller.createCategory);
router.put('/:id',extractJWT, controller.updateCategory);
router.delete('/:id',extractJWT, controller.deleteCategory);

export = router;
