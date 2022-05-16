"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var express_1 = __importDefault(require("express"));
var vendors_1 = __importDefault(require("../../controllers/vendors/vendors"));
var extractJWT_1 = __importDefault(require("../../middleware/extractJWT"));
var multerCloudinary_1 = __importDefault(require("../../functions/multerCloudinary"));
var router = express_1.default.Router();
router.post('/', vendors_1.default.registerVendor);
router.get('/', vendors_1.default.getAllVendors);
router.get('/:id', vendors_1.default.getSingleVendors);
router.delete('/:id', extractJWT_1.default, vendors_1.default.deleteVendor);
router.put('/:id', extractJWT_1.default, vendors_1.default.updateVendor);
router.put('/uploadImage/:id', multerCloudinary_1.default.single("image"), vendors_1.default.uploadVendorImages);
module.exports = router;
