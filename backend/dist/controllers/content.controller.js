"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSharedContent = exports.shareLink = exports.deleteContent = exports.getUserContent = exports.addContent = void 0;
const content_model_1 = require("../models/content.model");
const link_model_1 = require("../models/link.model");
const crypto_1 = require("crypto");
const user_model_1 = require("../models/user.model");
const addContent = async (req, res) => {
    try {
        const { title, type, link } = req.body;
        const userId = req.userId;
        if (!Object.values(content_model_1.ContentTypes).includes(type)) {
            return res.status(404).json({ message: `${type} not supported, must be in ${Object.values(content_model_1.ContentTypes)}` });
        }
        await content_model_1.Content.create({
            userId: userId,
            title: title,
            type: type,
            link: link,
            tags: []
        });
        res.status(200).json({ message: "Content Added" });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server Error" });
    }
};
exports.addContent = addContent;
const getUserContent = async (req, res) => {
    try {
        const userId = req.userId;
        const content = await content_model_1.Content.find({ userId: userId }).populate('userId', 'username');
        res.json(content);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server Error:" });
    }
};
exports.getUserContent = getUserContent;
const deleteContent = async (req, res) => {
    try {
        const { contentId } = req.body;
        if (!contentId) {
            return res.status(400).json({ message: "Content ID is required" });
        }
        const result = await content_model_1.Content.deleteMany({ _id: contentId, userId: req.userId });
        if (!result) {
            return res.status(404).json({ message: "Content not found or already deleted" });
        }
        res.status(202).json({ message: "Deleted" });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server Error: " });
    }
};
exports.deleteContent = deleteContent;
const shareLink = async (req, res) => {
    try {
        const { share } = req.body;
        if (share) {
            const existingLink = await link_model_1.Links.findOne({ userId: req.userId });
            if (existingLink) {
                return res.status(200).json({ message: "Data stored", hash: existingLink.hash });
            }
            const hash = (0, crypto_1.randomBytes)(10).toString("hex");
            const linkCreated = await link_model_1.Links.create({ userId: req.userId, hash });
            return res.status(200).json({ hash, linkCreated });
        }
        else {
            await link_model_1.Links.deleteOne({ userId: req.userId });
            return res.json({ message: "Removed link" });
        }
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: "internal server Error" });
    }
};
exports.shareLink = shareLink;
const getSharedContent = async (req, res) => {
    try {
        const hash = req.params.shareLink;
        const link = await link_model_1.Links.findOne({ hash });
        if (!link) {
            res.status(404).json({ message: "Invalid share link" });
            return;
        }
        const content = await content_model_1.Content.find({ userId: req.userId });
        const user = await user_model_1.User.findOne({ _id: link.userId });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        return res.json({
            username: user.username,
            content
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};
exports.getSharedContent = getSharedContent;
exports.default = { addContent: exports.addContent, getUserContent: exports.getUserContent, deleteContent: exports.deleteContent };
