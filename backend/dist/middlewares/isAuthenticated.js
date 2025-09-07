"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAuthenticated = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
require("express");
const getJwtSecret_1 = require("../utils/getJwtSecret");
const isAuthenticated = (req, res, next) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({ message: "Invalid token format" });
        }
        const decoded = jsonwebtoken_1.default.verify(token, (0, getJwtSecret_1.getJwtSecret)());
        if (decoded) {
            req.userId = decoded.id;
            next();
        }
        else {
            res.status(401).json({ message: "Unauthorized User" });
        }
    }
    catch (error) {
        console.log(error);
        res.status(401).json({ message: "Unauthorized User" });
    }
};
exports.isAuthenticated = isAuthenticated;
