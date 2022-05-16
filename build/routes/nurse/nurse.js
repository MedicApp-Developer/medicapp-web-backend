"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var express_1 = __importDefault(require("express"));
var nurse_1 = __importDefault(require("../../controllers/nurse/nurse"));
var isHospital_1 = __importDefault(require("../../middleware/isHospital"));
var isHospitalOrNurse_1 = __importDefault(require("../../middleware/isHospitalOrNurse"));
var router = express_1.default.Router();
router.get('/', isHospital_1.default, nurse_1.default.getAllNurses);
router.get('/:id', isHospitalOrNurse_1.default, nurse_1.default.getSingleNurse);
router.post('/', isHospital_1.default, nurse_1.default.createNurse);
router.put('/:id', isHospitalOrNurse_1.default, nurse_1.default.updateNurse);
router.delete('/:id', isHospital_1.default, nurse_1.default.deleteNurse);
router.get('/search/:searchedText', isHospital_1.default, nurse_1.default.searchNurse);
module.exports = router;
