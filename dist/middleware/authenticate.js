"use strict";
// import { NextFunction, Request, Response } from 'express';
// import BlacklistedToken from "../models/tokenBlackList.model";
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
const constants_1 = require("../utils/constants");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_model_1 = __importDefault(require("../models/user.model"));
const authenticateBlackList = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('Blacklist middleware entered');
    const accessToken = req.cookies['accessToken'];
    if (!accessToken) {
        return res.status(401).send({ failToken: true, message: 'No access token provided' });
    }
    try {
        // Check if token is blacklisted
        const isBlacklisted = yield tokenBlackList_model_1.default.findOne({ token: accessToken });
        if (isBlacklisted) {
            return res.status(401).send({ success: false, message: "Token is blacklisted. Please log in again." });
        }
        // Verify token
        const decodedData = jsonwebtoken_1.default.verify(accessToken, constants_1.JWT_SECRET);
        if (!decodedData || !decodedData.user) {
            return res.status(401).send({ success: false, message: "Invalid token." });
        }
        // Fetch user from DB
        const userFromDB = yield user_model_1.default.findById(decodedData.user).select('version');
        if (!userFromDB) {
            return res.status(401).send({ success: false, message: "User not found." });
        }
        // Check if token version matches user version
        if (decodedData.version !== userFromDB.version) {
            return res.status(401).send({ success: false, message: "Token is blacklist. Please log in again." });
        }
        // Attach user data to request
        req.user = decodedData;
        console.log('Blacklist middleware passed');
        next();
    }
    catch (error) {
        console.error("Authentication error:", error);
        return res.status(401).send({ success: false, message: "Invalid or expired token." });
    }
});
exports.default = authenticateBlackList;
