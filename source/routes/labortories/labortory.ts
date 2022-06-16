import express from 'express';
import controller from '../../controllers/labortories/labortory';
import extractJWT from '../../middleware/extractJWT';
import isHospital from '../../middleware/isHospital';
import upload from '../../functions/multerCloudinary';

const router = express.Router();

router.get('/', extractJWT,controller.getAllLabortories);
router.get('/:id', extractJWT,controller.getSingleLabortory); 
router.post('/', isHospital, controller.createLabortory);
router.put('/:id',extractJWT, controller.updateLabortory);
router.delete('/:id',isHospital, controller.deleteLabortory);
router.get('/search/:searchedText', isHospital, controller.searchLabortory);

router.delete('/deleteProfileImage/:doctorId', extractJWT, controller.deleteProfileImage);
router.put('/uploadProfilePicture/:id', upload.single("image"), controller.uploadProfilePic);


export = router;
