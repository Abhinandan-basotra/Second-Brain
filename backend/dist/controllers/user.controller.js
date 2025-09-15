"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.signup = void 0;
const bcrypt_ts_1 = __importDefault(require("bcrypt-ts"));
const user_model_1 = require("../models/user.model");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const getJwtSecret_1 = require("../utils/getJwtSecret");
var StatusResponse;
(function (StatusResponse) {
    StatusResponse[StatusResponse["SUCCESS"] = 200] = "SUCCESS";
    StatusResponse[StatusResponse["ERROR_IN_INPUTS"] = 411] = "ERROR_IN_INPUTS";
    StatusResponse[StatusResponse["USER_EXISTS"] = 403] = "USER_EXISTS";
    StatusResponse[StatusResponse["SERVER_ERROR"] = 500] = "SERVER_ERROR";
})(StatusResponse || (StatusResponse = {}));
const signup = async (req, res) => {
    try {
        const { username, password } = req.body;
        const hashedPass = await bcrypt_ts_1.default.hash(password, 10);
        if (!username || !password) {
            res.status(StatusResponse.ERROR_IN_INPUTS).json({ message: "missing username or password" });
        }
        const existingUser = await user_model_1.User.findOne({ username: username });
        if (existingUser)
            res.status(StatusResponse.USER_EXISTS).json({ message: "user exists already" });
        await user_model_1.User.create({
            username: username,
            password: hashedPass
        });
        res.status(StatusResponse.SUCCESS).json({ message: 'User Signed Up' });
    }
    catch (error) {
        console.log(error);
        res.status(StatusResponse.SERVER_ERROR).json({ message: "Internal Server Error" });
    }
};
exports.signup = signup;
const login = async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json({ message: "Fill all the details" });
        }
        const user = await user_model_1.User.findOne({ username });
        if (!user) {
            return res
                .status(StatusResponse.ERROR_IN_INPUTS)
                .json({ message: "Invalid Username or password" });
        }
        const isMatch = await bcrypt_ts_1.default.compare(password, user.password);
        if (!isMatch) {
            return res
                .status(StatusResponse.ERROR_IN_INPUTS)
                .json({ message: "Invalid Username or password" });
        }
        const token = jsonwebtoken_1.default.sign({ id: user.id }, (0, getJwtSecret_1.getJwtSecret)(), { expiresIn: "4h" });
        res.cookie("token", token, {
            httpOnly: true,
            secure: false,
            sameSite: "strict",
            maxAge: 4 * 60 * 60 * 1000,
        });
        return res
            .status(StatusResponse.SUCCESS)
            .json({ message: `Welcome back! ${user.username}`, user, token });
    }
    catch (error) {
        console.error(error);
        res
            .status(StatusResponse.SERVER_ERROR)
            .json({ message: "Server Error" });
    }
};
exports.login = login;
exports.default = { signup: exports.signup, login: exports.login };
