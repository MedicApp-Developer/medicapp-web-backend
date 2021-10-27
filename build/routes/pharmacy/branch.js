"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var express_1 = __importDefault(require("express"));
var branch_1 = __importDefault(require("../../controllers/pharmacy/branch"));
var extractJWT_1 = __importDefault(require("../../middleware/extractJWT"));
var isPharmacy_1 = __importDefault(require("../../middleware/isPharmacy"));
var router = express_1.default.Router();
router.get('/:pharmacyId', extractJWT_1.default, branch_1.default.getAllBranchesOfPharmacy);
router.get('/:branchId', extractJWT_1.default, branch_1.default.getSingleBranch);
router.post('/', [isPharmacy_1.default], branch_1.default.createBranch);
router.put('/:id', extractJWT_1.default, branch_1.default.updateBranch);
router.delete('/:id', extractJWT_1.default, branch_1.default.deleteBranch);
router.get('/search/:searchedText', extractJWT_1.default, branch_1.default.searchBranch);
module.exports = router;
