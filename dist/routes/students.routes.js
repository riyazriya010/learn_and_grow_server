"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const students_controller_1 = __importDefault(require("../controllers/students.controller"));
const verifyToken_1 = __importDefault(require("../middleware/verifyToken"));
const blocked_1 = __importDefault(require("../middleware/blocked"));
const verified_1 = __importDefault(require("../middleware/verified"));
const userController = new students_controller_1.default();
const router = (0, express_1.Router)();
router.post('/student/login', userController.studentLogin.bind(userController));
router.post('/student/signup', userController.studentSignup.bind(userController));
router.post('/student/google-signUp', userController.studentGoogleSignIn.bind(userController));
router.post('/student/google-login', userController.studentGoogleLogin.bind(userController));
router.patch('/student/forget-password', userController.forgetPassword.bind(userController));
router.patch('/student/profile-update', verifyToken_1.default, verified_1.default, blocked_1.default, userController.profileUpdate.bind(userController));
router.patch('/verify', userController.verifyStudent.bind(userController));
router.get('/student/re-verify', verifyToken_1.default, blocked_1.default, userController.studentReVerify.bind(userController));
router.get('/student/check', userController.checkStudent.bind(userController));
/* ------------------------------------ WEEK -2 ---------------------------------*/
router.get('/get/all-course', userController.getAllCourses.bind(userController));
router.get('/get/course', userController.getCourse.bind(userController));
const userRoutes = router;
exports.default = userRoutes;
