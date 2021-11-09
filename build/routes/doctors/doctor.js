"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var express_1 = __importDefault(require("express"));
var doctor_1 = __importDefault(require("../../controllers/doctors/doctor"));
var extractJWT_1 = __importDefault(require("../../middleware/extractJWT"));
var isHospital_1 = __importDefault(require("../../middleware/isHospital"));
var isHospitalOrNurse_1 = __importDefault(require("../../middleware/isHospitalOrNurse"));
var router = express_1.default.Router();
router.get('/', isHospitalOrNurse_1.default, doctor_1.default.getAllDoctors);
router.get('/:id', extractJWT_1.default, doctor_1.default.getSingleDoctor);
router.post('/', isHospital_1.default, doctor_1.default.createDoctor);
router.put('/:id', extractJWT_1.default, doctor_1.default.updateDoctor);
router.delete('/:id', isHospital_1.default, doctor_1.default.deleteDoctor);
router.get('/search/:searchedText', isHospital_1.default, doctor_1.default.searchDoctor);
router.get('/searchHospitalAndDoctor/:searchedText', doctor_1.default.searchHospitalAndDoctor);
module.exports = router;
