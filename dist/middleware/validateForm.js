"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateForm = void 0;
const validationRules_1 = require("../utils/validationRules");
const validateField = (value, rule) => {
    if (rule.required && (value === undefined || value === null || value === "")) {
        return `${rule.field} is required`;
    }
    if (rule.type) {
        if (rule.type === "string" && typeof value !== "string")
            return `${rule.field} must be a string`;
        if (rule.type === "number" && typeof value !== "number")
            return `${rule.field} must be a number`;
        if (rule.type === "email" && !/^\S+@\S+\.\S+$/.test(value))
            return `${rule.field} must be a valid email`;
        if (rule.type === "boolean" && typeof value !== "boolean")
            return `${rule.field} must be a boolean`;
    }
    if (rule.minLength && typeof value === "string" && value.length < rule.minLength) {
        return `${rule.field} must be at least ${rule.minLength} characters long`;
    }
    if (rule.maxLength && typeof value === "string" && value.length > rule.maxLength) {
        return `${rule.field} must not exceed ${rule.maxLength} characters`;
    }
    if (rule.regex && !rule.regex.test(value)) {
        return `${rule.field} is invalid`;
    }
    if (rule.customValidator && !rule.customValidator(value)) {
        return rule.errorMessage || `${rule.field} is invalid`;
    }
    return null;
};
// This is for handle validation
const validateForm = (formName) => {
    return (req, res, next) => {
        const rules = validationRules_1.validationRules[formName];
        if (!rules) {
            return res.status(400).json({ error: "Validation rules not defined for this form" });
        }
        const errors = {};
        rules.forEach((rule) => {
            const error = validateField(req.body[rule.field], rule);
            if (error) {
                errors[rule.field] = error;
            }
        });
        if (Object.keys(errors).length > 0) {
            return res.status(400).json({ errors });
        }
        next();
    };
};
exports.validateForm = validateForm;
