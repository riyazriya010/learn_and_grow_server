"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MENTOR_PORT_LINK = exports.STUDENT_PORT_LINK = exports.JWT_SECRET = exports.FRONTEND_URL = exports.MONGO_URI = exports.PORT = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.PORT = process.env.PORT || 8002;
exports.MONGO_URI = String(process.env.MONGO_URI);
exports.FRONTEND_URL = String(process.env.FRONTEND_URL);
exports.JWT_SECRET = String(process.env.JWT_SECRET);
exports.STUDENT_PORT_LINK = 'https://www.learngrow.live/pages/student/verify';
exports.MENTOR_PORT_LINK = 'https://www.learngrow.live/pages/mentor/verify';
// want to build and token set for alll signup also
