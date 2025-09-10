"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const db_1 = require("./utils/db");
const user_router_1 = __importDefault(require("./routers/user.router"));
const content_router_1 = __importDefault(require("./routers/content.router"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
dotenv_1.default.config({});
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
const corsOptions = {
    origin: "http://localhost:5173/"
};
app.use((0, cors_1.default)(corsOptions));
app.use((0, cookie_parser_1.default)());
app.use('/api/v1/', user_router_1.default);
app.use('/api/v1/', content_router_1.default);
const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}.`);
    (0, db_1.connectDb)();
});
