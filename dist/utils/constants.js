"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JWT_SECRET = exports.FRONTEND_URL = exports.MONGO_URI = exports.PORT = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.PORT = process.env.PORT || 8002;
// export const MONGO_URI = () => {
//     if(!process.env.MONGO_URI) throw new Error("Mongo URI not found in env");
//     return String(process.env.MONGO_URI)
// }
// export const FRONTEND_URL = () => {
//     if (!process.env.FRONTEND_URL) return null;
//     return String(process.env.FRONTEND_URL);
//   };
exports.MONGO_URI = String(process.env.MONGO_URI);
exports.FRONTEND_URL = String(process.env.FRONTEND_URL);
exports.JWT_SECRET = String(process.env.JWT_SECRET);
