"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var express_1 = __importDefault(require("express"));
var package_1 = __importDefault(require("../../controllers/vendors/package"));
var extractJWT_1 = __importDefault(require("../../middleware/extractJWT"));
var multerCloudinary_1 = __importDefault(require("../../functions/multerCloudinary"));
var router = express_1.default.Router();
router.post('/', multerCloudinary_1.default.single("image"), package_1.default.createPackage);
router.get('/', package_1.default.getAllPackages);
router.get('/:id', package_1.default.getSinglePackage);
router.get('/vendor/:vendorId', package_1.default.getVendorPackages);
router.delete('/:id', extractJWT_1.default, package_1.default.deletePackage);
router.put('/:id', multerCloudinary_1.default.single("image"), package_1.default.updatePackage);
module.exports = router;
