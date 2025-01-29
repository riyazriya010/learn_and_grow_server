"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validationRules = void 0;
exports.validationRules = {
    signupForm: [
        { field: "username", required: true, type: "string", minLength: 3, maxLength: 30, errorMessage: "Invalid username" },
        { field: "email", required: true, type: "email", errorMessage: "Invalid email address" },
        { field: "password", required: true, type: "string", minLength: 6, errorMessage: "Password must be at least 6 characters" },
    ],
    loginForm: [
        { field: "email", required: true, type: "email", errorMessage: "Invalid email address" },
        { field: "password", required: true, type: "string", errorMessage: "Password is required" },
    ],
};
