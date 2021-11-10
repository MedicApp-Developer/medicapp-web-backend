import express from 'express';
import controller from '../../controllers/doctors/speciality';
import extractJWT from '../../middleware/extractJWT';

const router = express.Router();

router.get('/', extractJWT,controller.getAllSpeciality);
router.get('/:id', extractJWT,controller.getSingleSpeciality);
router.post('/', extractJWT, controller.createSpeciality);
router.put('/:id',extractJWT, controller.updateSpeciality);
router.delete('/:id',extractJWT, controller.deleteSpeciality);

export = router;
