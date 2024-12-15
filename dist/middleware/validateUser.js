"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateUser = void 0;
const joi_1 = __importDefault(require("joi"));
const userValidationSchema = joi_1.default.object({
    username: joi_1.default.string().required(),
    email: joi_1.default.string().email().required(),
    phone: joi_1.default.string().pattern(/^\d+$/).required(),
    password: joi_1.default.string().min(6).required(),
});
const validateUser = (req, res, next) => {
    const { error } = userValidationSchema.validate(req.body);
    if (error) {
        res.status(400).json({ message: error.details[0].message });
        return; // Stop execution if validation fails
    }
    next(); // Proceed to the next middleware or route handler
};
exports.validateUser = validateUser;
