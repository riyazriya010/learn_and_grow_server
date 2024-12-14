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
Object.defineProperty(exports, "__esModule", { value: true });
const userService_1 = require("../services/userService");
const userServices = new userService_1.UserServices();
// The controller should be typed to return a Promise of Response.
const signupController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, email, phone, password } = req.body;
        if (!username || !email || !phone || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }
        const newUser = yield userServices.signUp({ username, email, phone, password });
        return res.status(201).json({
            message: "User created successfully!",
            user: { username: newUser.username, email: newUser.email, phone: newUser.phone },
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Something went wrong. Please try again later." });
    }
});
exports.default = signupController;
