"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var express_1 = __importDefault(require("express"));
var family_1 = __importDefault(require("../controllers/family"));
var extractJWT_1 = __importDefault(require("../middleware/extractJWT"));
var router = express_1.default.Router();
router.post('/', extractJWT_1.default, family_1.default.createFamilyMember);
router.delete('/:id', extractJWT_1.default, family_1.default.deleteFamilyMember);
module.exports = router;
