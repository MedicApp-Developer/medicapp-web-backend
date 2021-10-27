"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var express_1 = __importDefault(require("express"));
var appointments_1 = __importDefault(require("../controllers/appointments"));
var extractJWT_1 = __importDefault(require("../middleware/extractJWT"));
var isHospital_1 = __importDefault(require("../middleware/isHospital"));
var isHospitalOrDoctor_1 = __importDefault(require("../middleware/isHospitalOrDoctor"));
var router = express_1.default.Router();
router.get('/', extractJWT_1.default, appointments_1.default.getAllAppointments);
router.get('/:id', extractJWT_1.default, appointments_1.default.getSingleAppointment);
router.post('/', appointments_1.default.createAppointment);
router.put('/:id', extractJWT_1.default, appointments_1.default.updateAppointment);
router.delete('/:id', extractJWT_1.default, appointments_1.default.deleteAppointment);
router.get('/hospitalAppointments/:hospitalId', isHospital_1.default, appointments_1.default.getHospitalAppointments);
router.get('/doctorAppointments/:doctorId', isHospitalOrDoctor_1.default, appointments_1.default.getDoctorAppointments);
module.exports = router;
