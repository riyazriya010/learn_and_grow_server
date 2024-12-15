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
    createUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('user controller - createUser: ', req.body);
                const { username, email, phone, password } = req.body;
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
}
exports.default = UserController;
