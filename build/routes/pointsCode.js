"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var express_1 = __importDefault(require("express"));
var pointsCode_1 = __importDefault(require("../controllers/pointsCode"));
var extractJWT_1 = __importDefault(require("../middleware/extractJWT"));
var router = express_1.default.Router();
router.get('/getHospitalCodes/:hospitalId', extractJWT_1.default, pointsCode_1.default.getHospitalPointsCode);
router.get('/getPatientCodes/:patientId', extractJWT_1.default, pointsCode_1.default.getPatientPointsCode);
router.post('/verifyCode', extractJWT_1.default, pointsCode_1.default.verifyCode);
module.exports = router;
