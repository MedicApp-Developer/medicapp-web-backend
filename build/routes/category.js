"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var express_1 = __importDefault(require("express"));
var category_1 = __importDefault(require("../controllers/category"));
var extractJWT_1 = __importDefault(require("../middleware/extractJWT"));
var router = express_1.default.Router();
router.get('/', extractJWT_1.default, category_1.default.getAllCategories);
router.get('/:id', extractJWT_1.default, category_1.default.getSingleCategory);
router.post('/', category_1.default.createCategory);
router.put('/:id', extractJWT_1.default, category_1.default.updateCategory);
router.delete('/:id', extractJWT_1.default, category_1.default.deleteCategory);
module.exports = router;
