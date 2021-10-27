"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var express_1 = __importDefault(require("express"));
var promos_1 = __importDefault(require("../../controllers/hospitals/promos"));
var isHospital_1 = __importDefault(require("../../middleware/isHospital"));
var router = express_1.default.Router();
router.get('/', isHospital_1.default, promos_1.default.getAllPromos);
router.post('/', isHospital_1.default, promos_1.default.createPromo);
router.delete('/:id', isHospital_1.default, promos_1.default.deletePromo);
module.exports = router;
