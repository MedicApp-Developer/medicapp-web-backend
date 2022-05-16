"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var express_1 = __importDefault(require("express"));
var bookmarks_1 = __importDefault(require("../controllers/bookmarks"));
var extractJWT_1 = __importDefault(require("../middleware/extractJWT"));
var router = express_1.default.Router();
router.post('/', extractJWT_1.default, bookmarks_1.default.createBookmark);
router.delete('/', extractJWT_1.default, bookmarks_1.default.deleteBookmark);
router.get('/', extractJWT_1.default, bookmarks_1.default.getBookmarks);
module.exports = router;
