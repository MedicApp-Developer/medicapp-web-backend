"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var express_1 = __importDefault(require("express"));
var labortory_1 = __importDefault(require("../../controllers/labortories/labortory"));
var extractJWT_1 = __importDefault(require("../../middleware/extractJWT"));
var isHospital_1 = __importDefault(require("../../middleware/isHospital"));
var router = express_1.default.Router();
router.get('/', extractJWT_1.default, labortory_1.default.getAllLabortories);
router.get('/:id', extractJWT_1.default, labortory_1.default.getSingleLabortory);
router.post('/', isHospital_1.default, labortory_1.default.createLabortory);
router.put('/:id', extractJWT_1.default, labortory_1.default.updateLabortory);
router.delete('/:id', isHospital_1.default, labortory_1.default.deleteLabortory);
router.get('/search/:searchedText', isHospital_1.default, labortory_1.default.searchLabortory);
module.exports = router;
