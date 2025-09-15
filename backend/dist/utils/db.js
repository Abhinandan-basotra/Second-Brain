"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDb = connectDb;
const mongoose_1 = __importDefault(require("mongoose"));
async function connectDb() {
    try {
        const mongoUri = process.env.MONGO_URI;
        if (!mongoUri) {
            throw new Error("❌ MONGO_URI is not defined in environment variables");
        }
        const conn = await mongoose_1.default.connect(mongoUri);
        console.log(`✅ MongoDB connected: ${conn.connection.host}/${conn.connection.name}`);
    }
    catch (error) {
        console.error("❌ MongoDB connection failed:", error);
        process.exit(1); // exit the process if db connection fails
    }
}
