"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var express_1 = __importDefault(require("express"));
var rewards_1 = __importDefault(require("../controllers/rewards"));
var router = express_1.default.Router();
router.post('/', rewards_1.default.subscribePackage);
router.put('/:id', rewards_1.default.approvePackage);
router.get('/:patientId', rewards_1.default.getAllPatientRewards);
router.get('/', rewards_1.default.getPatientRewardsHomeData);
router.get('/vendor/:vendorId', rewards_1.default.getAllVendorRewards);
module.exports = router;
