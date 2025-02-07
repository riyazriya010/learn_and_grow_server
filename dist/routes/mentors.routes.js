"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
// import { MentorController } from "../controllers/mentors.controller";
const blocked_1 = __importDefault(require("../middleware/blocked"));
const verifyToken_1 = __importDefault(require("../middleware/verifyToken"));
const verified_1 = __importDefault(require("../middleware/verified"));
const multer_1 = __importDefault(require("../middleware/multer"));
const mentor_repository_1 = __importDefault(require("../repositories/entities/mentor.repository"));
const mentor_services_1 = __importDefault(require("../services/business/mentor.services"));
const mentor_controller_1 = __importDefault(require("../controllers/management/mentor.controller"));
const router = (0, express_1.Router)();
// const mentorController = new MentorController()
const repository = new mentor_repository_1.default();
const services = new mentor_services_1.default(repository);
const controller = new mentor_controller_1.default(services);
/////////////////////////////////// WEEK - 1 //////////////////////
router.post('/mentor/login', controller.MentorLogin.bind(controller));
router.post('/mentor/signup', controller.mentorSignUp.bind(controller));
router.post('/mentor/google-signUp', controller.mentorGoogleSignUp.bind(controller));
router.post('/mentor/google-login', controller.mentorGoogleLogin.bind(controller));
router.patch('/mentor/forget-password', controller.mentorForgetPassword.bind(controller));
router.patch('/mentor/profile-update', verifyToken_1.default, blocked_1.default, verified_1.default, multer_1.default.single('profile'), controller.mentorProfileUpdate.bind(controller));
router.get('/mentor/check', verifyToken_1.default, blocked_1.default, controller.mentorCheck.bind(controller));
router.patch('/verify', controller.mentorVerify.bind(controller));
router.get('/mentor/re-verify', verifyToken_1.default, blocked_1.default, controller.mentorReVerify.bind(controller));
//////////////////////////////////// WEEK - 2 ///////////////////////
router.post('/mentor/course-upload', verifyToken_1.default, blocked_1.default, verified_1.default, multer_1.default.fields([
    { name: 'demoVideo', maxCount: 5 },
    { name: 'thumbnail', maxCount: 1 }
]), controller.mentorAddCourse.bind(controller));
router.get('/get/all-course', verifyToken_1.default, blocked_1.default, controller.mentorGetAllCourse.bind(controller));
router.get('/get/course', verifyToken_1.default, blocked_1.default, controller.mentorGetCourse.bind(controller));
router.patch('/edit/course', verifyToken_1.default, blocked_1.default, verified_1.default, multer_1.default.fields([
    { name: 'demoVideo', maxCount: 5 },
    { name: 'thumbnail', maxCount: 1 }
]), controller.mentorEditCourse.bind(controller));
router.patch('/unPublish/course', verifyToken_1.default, blocked_1.default, verified_1.default, controller.mentorUnPulishCourse.bind(controller));
router.patch('/publish/course', verifyToken_1.default, blocked_1.default, verified_1.default, controller.mentorPublishCourse.bind(controller));
router.get('/filter/course', verifyToken_1.default, blocked_1.default, controller.mentorFilterCourse.bind(controller));
router.get(`/get/categories`, verifyToken_1.default, blocked_1.default, controller.mentorGetAllCategorise.bind(controller));
router.post('/mentor/chapter-upload', verifyToken_1.default, blocked_1.default, verified_1.default, multer_1.default.single('chapterVideo'), controller.mentorAddChapter.bind(controller));
router.patch('/edit/chapter', verifyToken_1.default, blocked_1.default, verified_1.default, multer_1.default.single('chapterVideo'), controller.mentorEditChapter.bind(controller));
router.get(`/get/all-chapters`, verifyToken_1.default, blocked_1.default, controller.mentorGetAllChapters.bind(controller));
router.post('/add/quizz', verifyToken_1.default, blocked_1.default, verified_1.default, controller.mentorAddQuizz.bind(controller));
router.get(`/get/all-quizz`, verifyToken_1.default, blocked_1.default, controller.mentorGetAllQuizz.bind(controller));
router.delete('/delete/quizz', verifyToken_1.default, blocked_1.default, verified_1.default, controller.mentorDeleteQuizz.bind(controller));
router.get('/get/wallet', verifyToken_1.default, blocked_1.default, verified_1.default, controller.mentorGetWallet.bind(controller));
//////////////////////////////////// WEEK - 3 /////////////////////////
router.get('/get/students', verifyToken_1.default, blocked_1.default, verified_1.default, controller.mentorChatGetStudents.bind(controller));
router.get('/get/mentor/messages/:studentId', verifyToken_1.default, blocked_1.default, verified_1.default, controller.mentorGetMessages.bind(controller));
router.post('/save/mentor/message', verifyToken_1.default, blocked_1.default, verified_1.default, controller.mentorSaveMessage.bind(controller));
router.post('/create/mentor/room', verifyToken_1.default, blocked_1.default, verified_1.default, controller.mentorCreateRoom.bind(controller));
router.patch('/delete/mentor/message/everyone/:messageId', verifyToken_1.default, blocked_1.default, verified_1.default, controller.mentorDeleteEveryOne.bind(controller));
router.patch('/reset/mentor/count/:studentId', verifyToken_1.default, blocked_1.default, verified_1.default, controller.mentorResetCount.bind(controller));
//notification
router.post('/create/mentor/chat/notification', verifyToken_1.default, blocked_1.default, verified_1.default, controller.mentorCreateNotification.bind(controller));
router.get('/get/mentor/notification/count/:mentorId', controller.mentorGetNotificationsCount.bind(controller));
router.get('/mentor/notifications/:mentorId', verifyToken_1.default, blocked_1.default, verified_1.default, controller.mentorGetNotifications.bind(controller));
router.patch('/mentor/notification/seen', verifyToken_1.default, blocked_1.default, verified_1.default, controller.mentorGetNotificationsSeen.bind(controller));
router.delete('/mentor/delete/notification/:senderId', verifyToken_1.default, blocked_1.default, verified_1.default, controller.mentorDeleteNotifications.bind(controller));
router.get('/get/student/:studentId', verifyToken_1.default, blocked_1.default, verified_1.default, controller.mentorGetStudent.bind(controller));
////////////////////////////////////////// WEEK - 4 ////////////////////////////////////////////////
router.get('/get/dashboard', verifyToken_1.default, blocked_1.default, verified_1.default, controller.mentorDashboard.bind(controller));
router.get('/get/chart/graph/data', verifyToken_1.default, blocked_1.default, verified_1.default, controller.mentorChartGraph.bind(controller));
router.get('/get/mentor/report', verifyToken_1.default, blocked_1.default, verified_1.default, controller.mentorSalesReport.bind(controller));
const mentorRoutes = router;
exports.default = mentorRoutes;
/* ------------------------------- WEEK 1 ---------------------------*/
// router.post('/mentor/login', mentorController.mentorLogin.bind(mentorController))
// router.post('/mentor/signup', mentorController.mentorSignUp.bind(mentorController))
// router.post('/mentor/google-login', mentorController.mentorGoogleLogin.bind(mentorController))
// router.post('/mentor/google-signUp', mentorController.mentorGoogleSignUp.bind(mentorController))
// router.patch('/mentor/forget-password', mentorController.forgetPassword.bind(mentorController))
// router.patch('/mentor/profile-update', authenticateToken, isUserBlocked, isUserVerified, uploadMiddleware.single('profile'), mentorController.profileUpdate.bind(mentorController))
// router.get('/mentor/check',authenticateToken, isUserBlocked, mentorController.checkMentor.bind(mentorController))
// router.patch('/verify', mentorController.verifyMentor.bind(mentorController))
// router.get('/mentor/re-verify', authenticateToken, isUserBlocked, mentorController.mentorReVerify.bind(mentorController))
// /* ------------------------------- WEEK 2 ---------------------------*/
// router.post('/mentor/course-upload', authenticateToken, isUserBlocked, isUserVerified, uploadMiddleware.fields([
//     { name: 'demoVideo', maxCount: 5 },
//     { name: 'thumbnail', maxCount: 1 }
// ]), mentorController.addCourse.bind(mentorController));
// router.get('/get/all-course',authenticateToken, isUserBlocked, mentorController.getAllCourses.bind(mentorController))
// router.get('/get/course',authenticateToken, isUserBlocked, mentorController.getCourse.bind(mentorController))
// router.patch('/edit/course', authenticateToken, isUserBlocked, isUserVerified, uploadMiddleware.fields([
//     { name: 'demoVideo', maxCount: 5 },
//     { name: 'thumbnail', maxCount: 1 }
// ]), mentorController.editCourse.bind(mentorController))
// router.patch('/unPublish/course',authenticateToken, isUserBlocked, isUserVerified, mentorController.unPublishCourse.bind(mentorController))
// router.patch('/publish/course',authenticateToken, isUserBlocked, isUserVerified, mentorController.publishCourse.bind(mentorController))
// router.get('/filter/course',authenticateToken, isUserBlocked, mentorController.filterCourse.bind(mentorController))
// router.get(`/get/categories`,authenticateToken, isUserBlocked, mentorController.getAllCategory.bind(mentorController))
// router.post('/mentor/chapter-upload',authenticateToken, isUserBlocked, isUserVerified, uploadMiddleware.single('chapterVideo'), mentorController.addChapter.bind(mentorController))
// router.patch('/edit/chapter',authenticateToken, isUserBlocked, isUserVerified, uploadMiddleware.single('chapterVideo'), mentorController.editChapter.bind(mentorController))
// router.get(`/get/all-chapters`,authenticateToken, isUserBlocked, mentorController.getAllChapters.bind(mentorController))
// router.post('/add/quizz',authenticateToken, isUserBlocked, isUserVerified, mentorController.addQuizz.bind(mentorController))
// router.get(`/get/all-quizz`,authenticateToken, isUserBlocked, mentorController.getAllQuizz.bind(mentorController))
// router.delete('/delete/quizz',authenticateToken, isUserBlocked, isUserVerified, mentorController.deleteQuizz.bind(mentorController))
// router.get('/get/wallet',authenticateToken, isUserBlocked, isUserVerified, mentorController.getWallet.bind(mentorController))
//////////////////////////////////////////// WEEK - 3 //////////////////////////////////
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
// router.post('/mentor/course/upload', uploadMiddleware, mentorController.addCourse.bind(mentorController))
