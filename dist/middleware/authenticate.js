"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const tokenBlackList_model_1 = __importDefault(require("../models/tokenBlackList.model"));
const authenticateBlackList = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('blacklist middleware entered ');
    const accessToken = req.cookies['accessToken'];
    if (!accessToken) {
        return res
            .status(401)
            .send({ failToken: true, message: 'No access token provided' });
    }
    tokenBlackList_model_1.default.findOne({ token: accessToken })
        .then((isBlacklisted) => {
        if (isBlacklisted) {
            res.status(401).send({ success: false, message: "Token is blacklisted. Please log in again." });
            return;
        }
        next(); // ✅ Correctly calling `next()`
    })
        .catch(() => {
        res.status(500).send({ success: false, message: "Internal Server Error." });
    });
    console.log('blacklist middleware crossed');
});
exports.default = authenticateBlackList;
