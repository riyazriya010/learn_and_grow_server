"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const mentors_controller_1 = require("../controllers/mentors.controller");
const verifyToken_1 = __importDefault(require("../middleware/verifyToken"));
const router = (0, express_1.Router)();
const mentorController = new mentors_controller_1.MentorController();
router.post('/mentor/login', mentorController.mentorLogin.bind(mentorController));
router.post('/mentor/signup', mentorController.mentorSignUp.bind(mentorController));
router.post('/mentor/google-login');
router.post('/mentor/sample', verifyToken_1.default, mentorController.sample.bind(mentorController));
const commonRoutes = router;
exports.default = commonRoutes;
