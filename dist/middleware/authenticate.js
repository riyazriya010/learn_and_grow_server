"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const tokenBlackList_model_1 = __importDefault(require("../models/tokenBlackList.model"));
dotenv_1.default.config();
const authenticateBlackList = (req, res, next) => {
    var _a, _b;
    console.log('req.cookies.accessToken ::: ', req.cookies.accessToken);
    console.log('req.headers.authorization ::: ', (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(" "));
    const token = req.cookies.accessToken || ((_b = req.headers.authorization) === null || _b === void 0 ? void 0 : _b.split(" ")[1]);
    if (!token) {
        res.status(401).json({ success: false, message: "Access Denied. No token provided." });
        return;
    }
    tokenBlackList_model_1.default.findOne({ token })
        .then((isBlacklisted) => {
        if (isBlacklisted) {
            res.status(401).json({ success: false, message: "Token is blacklisted. Please log in again." });
            return;
        }
        next(); // ✅ Correctly calling `next()`
    })
        .catch(() => {
        res.status(500).json({ success: false, message: "Internal Server Error." });
    });
};
exports.default = authenticateBlackList;
