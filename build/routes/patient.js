"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var express_1 = __importDefault(require("express"));
var patient_1 = __importDefault(require("../controllers/patient"));
var extractJWT_1 = __importDefault(require("../middleware/extractJWT"));
var isHospitalOrNurse_1 = __importDefault(require("../middleware/isHospitalOrNurse"));
var isNurse_1 = __importDefault(require("../middleware/isNurse"));
var router = express_1.default.Router();
router.get('/', extractJWT_1.default, patient_1.default.getAllPatients);
router.get('/:id', extractJWT_1.default, patient_1.default.getSinglePatient);
router.post('/', patient_1.default.createPatient);
// router.post('/', [ isHospitalOrNurse, upload.single("emiratesIdFile") ] ,controller.createPatient);
router.put('/:id', isHospitalOrNurse_1.default, patient_1.default.updatePatient);
router.delete('/:id', isHospitalOrNurse_1.default, patient_1.default.deletePatient);
router.post('/createNursePatient', isNurse_1.default, patient_1.default.createPatientFromNurse);
module.exports = router;
