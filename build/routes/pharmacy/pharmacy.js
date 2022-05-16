"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var express_1 = __importDefault(require("express"));
var pharmacy_1 = __importDefault(require("../../controllers/pharmacy/pharmacy"));
var extractJWT_1 = __importDefault(require("../../middleware/extractJWT"));
var fileUpload_1 = __importDefault(require("../../functions/fileUpload"));
var router = express_1.default.Router();
router.get('/', extractJWT_1.default, pharmacy_1.default.getAllPharmacies);
router.get('/:id', extractJWT_1.default, pharmacy_1.default.getSinglePharmacy);
router.post('/', [fileUpload_1.default.single("tradeLicenseFile")], pharmacy_1.default.createPharmacy);
router.put('/:id', extractJWT_1.default, pharmacy_1.default.updatePharmacy);
router.delete('/:id', extractJWT_1.default, pharmacy_1.default.deletePharmacy);
router.get('/search/:searchedText', extractJWT_1.default, pharmacy_1.default.searchPharmacy);
module.exports = router;
