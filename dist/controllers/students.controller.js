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
const userService_1 = __importDefault(require("../services/userService"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jwt_1 = require("../integration/jwt");
class UserController {
    constructor() {
        this.userServices = new userService_1.default();
    }
    getAllusers(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const getUsers = yield this.userServices.getAllUsers();
                if (!getUsers || getUsers.length === 0) {
                    return res.status(404).json({ message: "No users found" });
                }
                return res.status(200).json(getUsers);
            }
            catch (error) {
                console.error('Error while getting data: ', error);
                return res.status(500).json({ message: "An error occurred", error: error });
            }
        });
    }
    //signup user
    createUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let { username, email, phone, password } = req.body;
                const saltRound = 10;
                const hashedPassword = yield bcrypt_1.default.hash(password, saltRound);
                password = hashedPassword;
                const response = yield this.userServices.createUser({ username, email, phone, password });
                if (!response) {
                    return res.status(400).json({ message: 'Email already exists' });
                }
                // return res.status(201).json(response);
                return res.status(201).send({ success: true });
            }
            catch (error) {
                console.error('Error while creating user: ', error);
                return res.status(500).json({ message: "An error occurred", error: error });
            }
        });
    }
    // login user
    findUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, password } = req.body;
                const response = yield this.userServices.findUser({ email, password });
                if (!response) {
                    console.log('invalid');
                    return res.status(400).json({ message: 'Invalid Credential' });
                }
                return res.status(201).send({ success: true });
            }
            catch (error) {
                console.error('Error while creating user: ', error);
                return res.status(500).json({ message: "An error occurred", error: error });
            }
        });
    }
    // verify student
    verifyUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const tokenFromUser = req.query.token; // Get the token from the query parameter
                console.log('Token from user:', tokenFromUser); // Debug log
                if (!tokenFromUser) {
                    throw new Error('Token not provided in request');
                }
                // Verify the token
                const verifiedToken = yield (0, jwt_1.verifyToken)(tokenFromUser);
                console.log('Verified token:', verifiedToken); // Debug log
                if (!verifiedToken.status) {
                    throw new Error(verifiedToken.message || 'Token verification failed');
                }
                const payload = verifiedToken.payload;
                // Ensure payload is valid
                if (!payload || typeof payload !== 'object' || !('id' in payload) || !('email' in payload)) {
                    throw new Error('Invalid token payload');
                }
                const { email } = payload;
                // Verify user using the email
                const response = yield this.userServices.verifyUser(email);
                if (!response) {
                    throw new Error('User not found or verification failed');
                }
                return res.status(201).send({ success: true, message: 'User verified successfully' });
            }
            catch (error) {
                console.error('Error while verifying user: ', error.message);
                return res.status(500).json({ message: "An error occurred", error: error.message });
            }
        });
    }
}
exports.default = UserController;
