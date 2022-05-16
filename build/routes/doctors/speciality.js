"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var express_1 = __importDefault(require("express"));
var speciality_1 = __importDefault(require("../../controllers/doctors/speciality"));
var extractJWT_1 = __importDefault(require("../../middleware/extractJWT"));
var multerCloudinary_1 = __importDefault(require("../../functions/multerCloudinary"));
var router = express_1.default.Router();
router.get('/', speciality_1.default.getAllSpeciality);
router.get('/:id', extractJWT_1.default, speciality_1.default.getSingleSpeciality);
router.post('/', multerCloudinary_1.default.single("image"), speciality_1.default.createSpeciality);
router.put('/:id', multerCloudinary_1.default.single("image"), extractJWT_1.default, speciality_1.default.updateSpeciality);
router.delete('/:id', extractJWT_1.default, speciality_1.default.deleteSpeciality);
module.exports = router;
