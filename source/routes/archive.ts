import express from 'express';
import controller from '../controllers/archive';
import extractJWT from '../middleware/extractJWT';
import upload from '../functions/multerCloudinary';

const router = express.Router();

router.post('/',upload.single("url"), extractJWT,controller.createArchive);
router.delete('/:id', extractJWT,controller.deleteArchive);
router.get('/', extractJWT,controller.getArchives);
router.get('/searchByPageNumber/:searchedText', extractJWT,controller.searchArchiveByPageNumber);
router.post('/filterByFromToDate', extractJWT,controller.filterFromToArchived);

export = router;
