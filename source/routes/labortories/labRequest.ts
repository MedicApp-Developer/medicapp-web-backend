import express from 'express';
import controller from '../../controllers/labortories/labRequest';
import extractJWT from '../../middleware/extractJWT';
import upload from '../../functions/multerCloudinary';

const router = express.Router();

router.post('/', extractJWT, controller.createLabRequest);
router.get('/:doctorId', extractJWT, controller.getLabRequests);
router.post('/updateRequest', upload.array("files"), controller.updateLabRequest);

export = router;
