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
const express_1 = require("express");
const user_controller_1 = __importDefault(require("../controllers/user.controller"));
class UserRoutes {
    constructor() {
        this.router = (0, express_1.Router)();
        this.userContorller = new user_controller_1.default();
        this.initializeRoutes(); // Set up routes
    }
    initializeRoutes() {
        this.router.get('/getUser', (req, res) => __awaiter(this, void 0, void 0, function* () {
            yield this.userContorller.getAllusers(req, res);
        }));
        this.router.post('/signup', (req, res) => __awaiter(this, void 0, void 0, function* () {
            console.log('user routes - post: ');
            yield this.userContorller.createUser(req, res);
        }));
    }
    getRouter() {
        return this.router; // Expose the router
    }
}
exports.default = UserRoutes;
