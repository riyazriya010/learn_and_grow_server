"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const mentors_controller_1 = require("../controllers/mentors.controller");
const blocked_1 = __importDefault(require("../middleware/blocked"));
const verifyToken_1 = __importDefault(require("../middleware/verifyToken"));
const verified_1 = __importDefault(require("../middleware/verified"));
const multer_1 = __importDefault(require("../middleware/multer"));
const router = (0, express_1.Router)();
const mentorController = new mentors_controller_1.MentorController();
/* ------------------------------- WEEK 1 ---------------------------*/
router.post('/mentor/login', mentorController.mentorLogin.bind(mentorController));
router.post('/mentor/signup', mentorController.mentorSignUp.bind(mentorController));
router.post('/mentor/google-login', mentorController.mentorGoogleLogin.bind(mentorController));
router.post('/mentor/google-signUp', mentorController.mentorGoogleSignUp.bind(mentorController));
router.patch('/mentor/forget-password', mentorController.forgetPassword.bind(mentorController));
router.patch('/mentor/profile-update', verifyToken_1.default, verified_1.default, blocked_1.default, mentorController.profileUpdate.bind(mentorController));
router.get('/mentor/check', mentorController.checkMentor.bind(mentorController));
router.patch('/verify', mentorController.verifyMentor.bind(mentorController));
router.get('/mentor/re-verify', verifyToken_1.default, blocked_1.default, mentorController.mentorReVerify.bind(mentorController));
/* ------------------------------- WEEK 2 ---------------------------*/
// router.post(
//     '/mentor/course/upload',
//     uploadMiddleware,
//     mentorController.addCourse.bind(mentorController) // Bind controller method
// );
// router.post('/mentor/course-upload', mentorController.addCourse.bind(mentorController))
// router.post('/mentor/course-upload', uploadMiddleware.fields([
//     { name: 'mainVideo', maxCount: 5 }, // Media files (images/videos)
//     { name: 'thumbnail', maxCount: 1 } // Thumbnail for videos
// ]), mentorController.addCourse.bind(mentorController));
router.post('/mentor/course-upload', multer_1.default.fields([
    { name: 'demoVideo', maxCount: 5 }, // Media files (images/videos)
    { name: 'thumbnail', maxCount: 1 } // Thumbnail for videos
]), mentorController.addCourse.bind(mentorController));
router.post('/mentor/chapter-upload', multer_1.default.single('chapterVideo'), mentorController.addChapter.bind(mentorController));
// router.post('/mentor/course/upload', uploadMiddleware, mentorController.addCourse.bind(mentorController))
const mentorRoutes = router;
exports.default = mentorRoutes;
