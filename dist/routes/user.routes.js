"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const signupController_1 = __importDefault(require("../controllers/signupController"));
const userRouter = express_1.default.Router();
// POST route to handle user signup
userRouter.post('/signup', signupController_1.default);
exports.default = userRouter;
