import express from 'express';
import controller from '../../controllers/nurse/nurse';
import isHospital from '../../middleware/isHospital';
import isHospitalOrNurse from '../../middleware/isHospitalOrNurse';
import upload from '../../functions/multerCloudinary';

const router = express.Router();

router.get('/', isHospital,controller.getAllNurses);
router.get('/:id', isHospitalOrNurse,controller.getSingleNurse); 
router.post('/', isHospital, controller.createNurse);
router.put('/:id',isHospitalOrNurse, controller.updateNurse);
router.delete('/:id',isHospital, controller.deleteNurse);
router.get('/search/:searchedText', isHospital, controller.searchNurse);
router.delete('/deleteProfileImage/:nurseId', controller.deleteProfileImage);
router.put('/uploadProfilePicture/:id', upload.single("image"), controller.uploadProfilePic);



export = router;
