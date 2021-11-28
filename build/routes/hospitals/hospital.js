"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var express_1 = __importDefault(require("express"));
var hospital_1 = __importDefault(require("../../controllers/hospitals/hospital"));
var extractJWT_1 = __importDefault(require("../../middleware/extractJWT"));
var router = express_1.default.Router();
router.get('/', extractJWT_1.default, hospital_1.default.getAllHospitals);
router.get('/:id', extractJWT_1.default, hospital_1.default.getSingleHospital);
router.post('/', hospital_1.default.createHospital);
router.put('/:id', extractJWT_1.default, hospital_1.default.updateHospital);
router.delete('/:id', extractJWT_1.default, hospital_1.default.deleteHospital);
router.get('/search/:searchedText', extractJWT_1.default, hospital_1.default.searchHospital);
router.put('/uploadImage/:id', extractJWT_1.default, hospital_1.default.uploadHospitalImages);
router.post('/filter', extractJWT_1.default, hospital_1.default.filterHospital);
module.exports = router;
