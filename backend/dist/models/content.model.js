"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Content = exports.ContentTypes = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
var ContentTypes;
(function (ContentTypes) {
    ContentTypes["Image"] = "image";
    ContentTypes["Video"] = "video";
    ContentTypes["Article"] = "article";
    ContentTypes["Audio"] = "audio";
})(ContentTypes || (exports.ContentTypes = ContentTypes = {}));
const contentSchema = new mongoose_1.default.Schema({
    link: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: Object.values(ContentTypes),
        required: true
    },
    title: {
        type: String,
        required: true
    },
    tags: [{
            type: mongoose_1.default.Schema.ObjectId,
            ref: 'Tags'
        }],
    userId: {
        type: mongoose_1.default.Schema.ObjectId,
        ref: 'User'
    }
});
exports.Content = mongoose_1.default.model('Content', contentSchema);
