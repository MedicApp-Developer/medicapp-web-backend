"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var express_1 = __importDefault(require("express"));
var QrPrescription_1 = __importDefault(require("../../controllers/labortories/QrPrescription"));
var extractJWT_1 = __importDefault(require("../../middleware/extractJWT"));
var router = express_1.default.Router();
router.post('/', extractJWT_1.default, QrPrescription_1.default.createQrPrescription);
router.get('/', extractJWT_1.default, QrPrescription_1.default.getQrPrescription);
module.exports = router;
