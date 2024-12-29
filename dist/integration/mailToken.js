"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = exports.generateAccessToken = exports.generateRandomFourDigitNumber = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const generateRandomFourDigitNumber = () => {
    return Math.floor(1000 + Math.random() * 9000);
};
exports.generateRandomFourDigitNumber = generateRandomFourDigitNumber;
const secret = 'my-secret';
const generateAccessToken = (payload) => {
    if (!payload) {
        throw new Error('Payload is required for generating access token');
    }
    const token = jsonwebtoken_1.default.sign(payload, secret, { expiresIn: '30s' });
    return token;
};
exports.generateAccessToken = generateAccessToken;
const verifyToken = (tokenFromUser) => {
    try {
        if (!tokenFromUser) {
            throw new Error('Token is required');
        }
        // Verify the token
        const decoded = jsonwebtoken_1.default.verify(tokenFromUser, secret);
        console.log('Decoded token:', decoded); // Debug log
        return {
            status: true,
            payload: decoded,
            message: 'Email verified successfully',
        };
    }
    catch (error) {
        if (error.name === 'TokenExpiredError') {
            throw new Error('Verification Token Expired');
        }
        console.error('Error in verifyToken:', error.message);
        return {
            status: false,
            message: error.message || 'Token verification failed',
        };
    }
};
exports.verifyToken = verifyToken;
