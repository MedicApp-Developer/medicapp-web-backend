"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var express_1 = __importDefault(require("express"));
var packageCategory_1 = __importDefault(require("../../controllers/vendors/packageCategory"));
var extractJWT_1 = __importDefault(require("../../middleware/extractJWT"));
var multerCloudinary_1 = __importDefault(require("../../functions/multerCloudinary"));
var router = express_1.default.Router();
router.get('/', packageCategory_1.default.getAllPackageCategories);
router.get('/:id', packageCategory_1.default.getSinglePackageCategory);
router.get('/offers/:id', packageCategory_1.default.getPackageCategoryOffers);
router.post('/', multerCloudinary_1.default.single("image"), packageCategory_1.default.createPackageCategory);
router.put('/:id', multerCloudinary_1.default.single("image"), packageCategory_1.default.updatePackageCategory);
router.delete('/:id', extractJWT_1.default, packageCategory_1.default.deletePackageCategory);
module.exports = router;
