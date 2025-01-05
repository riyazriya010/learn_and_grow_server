"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const getId = (token, req) => {
    try {
        const accessToken = req.cookies['accessToken'];
        console.log('acc', accessToken);
        const decodedData = jsonwebtoken_1.default.decode(accessToken);
        const { user } = decodedData;
        return user;
    }
    catch (error) {
        console.error("Error verifying token:", error);
        return null; // Return null if there's any error
    }
};
exports.default = getId;
