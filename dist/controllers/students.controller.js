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
const mailToken_1 = require("../integration/mailToken");
class UserController {
    constructor() {
        this.userServices = new userService_1.default();
    }
    getAllusers(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const getUsers = yield this.userServices.getAllUsers();
                if (!getUsers || getUsers.length === 0) {
                    res.status(404).json({ message: "No users found", success: false });
                }
                res.status(200).json({ user: getUsers, message: 'Users found', success: true });
            }
            catch (error) {
                console.error('Error while getting data: ', error);
                res.status(500).json({ message: "An error occurred", error: error });
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
                if (response) {
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
                const userData = yield this.userServices.findByEmail(email);
                if (!userData) {
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
                const verifiedToken = yield (0, mailToken_1.verifyToken)(tokenFromUser);
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
    googleLogin(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, displayName } = req.body;
                const googleUser = yield this.userServices.googleUser(email, displayName);
                console.log(googleUser);
                if (!googleUser) {
                    return res.status(400).json({ message: 'Error Accord in Google signin' });
                }
                return res.status(201).send({ success: true });
            }
            catch (error) {
                console.error('Error while verifying user: ', error.message);
                return res.status(500).json({ message: "An error occurred", error: error.message });
            }
        });
    }
    // new methods
    studentSignup(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let { username, email, phone, password } = req.body;
                const saltRound = 10;
                const hashPassword = yield bcrypt_1.default.hash(password, saltRound);
                password = hashPassword;
                const ExistUser = yield this.userServices.findByEmail(email);
                if (ExistUser) {
                    console.log('Existtttttt');
                    // return res.status(409).json({message: 'User Already Exist', success: false})
                    return res.send({ message: 'User Already Exist', success: true, status: 409 });
                }
                console.log('after exitttt');
                const addStudent = yield this.userServices.studentSignup({ username, email, phone, password });
                return res.send({ user: addStudent, message: 'User Successfully Added', success: true });
            }
            catch (error) {
                console.error(error);
            }
        });
    }
    studentGoogleSignIn(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, displayName } = req.body;
                const ExistUser = yield this.userServices.findByEmail(email);
                if (ExistUser) {
                    return res.send({ message: 'User Already Exist', success: true, status: 409 });
                }
                const addStudent = yield this.userServices.studentGoogleSignIn(email, displayName);
                return res.send({ user: addStudent, message: 'User Successfully Added', success: true });
            }
            catch (error) {
                console.error(error.message);
            }
        });
    }
    studentLogin(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, password } = req.body;
                const loggedUser = yield this.userServices.studentLogin(email, password);
                if (loggedUser === null) {
                    return res.status(401).send({ message: 'Invalid Credentials', success: false });
                }
                return res.send({ message: 'User Logged Successfully', success: true, status: 200 });
            }
            catch (error) {
                console.error(error);
            }
        });
    }
}
exports.default = UserController;
