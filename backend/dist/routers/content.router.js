"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const isAuthenticated_1 = require("../middlewares/isAuthenticated");
const content_controller_1 = require("../controllers/content.controller");
const router = express_1.default.Router();
router.route('/content').post(isAuthenticated_1.isAuthenticated, content_controller_1.addContent);
router.route('/content').get(isAuthenticated_1.isAuthenticated, content_controller_1.getUserContent);
router.route('/content').delete(isAuthenticated_1.isAuthenticated, content_controller_1.deleteContent);
router.route('/brain/share').post(isAuthenticated_1.isAuthenticated, content_controller_1.shareLink);
router.route('/brain/:shareLink').get(isAuthenticated_1.isAuthenticated, content_controller_1.getSharedContent);
exports.default = router;
