"use strict";
// import { MentorController } from "../controllers/mentors.controller";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// import MentorRepository from "../repositories/entities/mentor.repository";
// import MentorServices from "../services/business/mentor.services";
// import MentorController from "../controllers/management/mentor.controller";
const express_1 = require("express");
const blocked_1 = __importDefault(require("../middleware/blocked"));
const verifyToken_1 = __importDefault(require("../middleware/verifyToken"));
const verified_1 = __importDefault(require("../middleware/verified"));
const multer_1 = __importDefault(require("../middleware/multer"));
const auth_controller_1 = require("../controllers/management/mentorControllers/auth.controller");
const course_controller_1 = require("../controllers/management/mentorControllers/course.controller");
const chapter_controller_1 = require("../controllers/management/mentorControllers/chapter.controller");
const chat_controller_1 = require("../controllers/management/mentorControllers/chat.controller");
const quizz_controller_1 = require("../controllers/management/mentorControllers/quizz.controller");
const notification_controller_1 = require("../controllers/management/mentorControllers/notification.controller");
const sales_controller_1 = require("../controllers/management/mentorControllers/sales.controller");
// import { MentorController } from "../controllers/mentors.controller";
// import MentorRepository from "../repositories/entities/mentor.repository";
// import MentorServices from "../services/business/mentor.services";
// import MentorController from "../controllers/management/mentor.controller";
const router = (0, express_1.Router)();
// const mentorController = new MentorController()
//Mentor Auth Routes
router.post('/mentor/login', auth_controller_1.mentorAuthController.MentorLogin.bind(auth_controller_1.mentorAuthController));
router.post('/mentor/signup', auth_controller_1.mentorAuthController.mentorSignUp.bind(auth_controller_1.mentorAuthController));
router.post('/mentor/google-signUp', auth_controller_1.mentorAuthController.mentorGoogleSignUp.bind(auth_controller_1.mentorAuthController));
router.post('/mentor/google-login', auth_controller_1.mentorAuthController.mentorGoogleLogin.bind(auth_controller_1.mentorAuthController));
router.patch('/mentor/forget-password', auth_controller_1.mentorAuthController.mentorForgetPassword.bind(auth_controller_1.mentorAuthController));
router.patch('/mentor/profile-update', verifyToken_1.default, blocked_1.default, verified_1.default, multer_1.default.single('profile'), auth_controller_1.mentorAuthController.mentorProfileUpdate.bind(auth_controller_1.mentorAuthController));
router.get('/mentor/check', verifyToken_1.default, blocked_1.default, auth_controller_1.mentorAuthController.mentorCheck.bind(auth_controller_1.mentorAuthController));
router.patch('/verify', auth_controller_1.mentorAuthController.mentorVerify.bind(auth_controller_1.mentorAuthController));
router.get('/mentor/re-verify', verifyToken_1.default, blocked_1.default, auth_controller_1.mentorAuthController.mentorReVerify.bind(auth_controller_1.mentorAuthController));
router.post('/mentor/generate-presigned-url', verifyToken_1.default, blocked_1.default, verified_1.default, auth_controller_1.mentorAuthController.getSignedUrl.bind(auth_controller_1.mentorAuthController));
router.post('/mentor/logout', verifyToken_1.default, blocked_1.default, verified_1.default, auth_controller_1.mentorAuthController.mentorLogout.bind(auth_controller_1.mentorAuthController));
//Mentor Course Routes
// router.post('/mentor/course-upload', authenticateToken, isUserBlocked, isUserVerified, uploadMiddleware.fields([
//     { name: 'demoVideo', maxCount: 5 },
//     { name: 'thumbnail', maxCount: 1 }
// ]), controller.mentorAddCourse.bind(controller));
router.post('/mentor/course-upload', verifyToken_1.default, blocked_1.default, verified_1.default, course_controller_1.mentorCourseController.mentorAddCourse.bind(course_controller_1.mentorCourseController));
router.get('/get/all-course', verifyToken_1.default, blocked_1.default, course_controller_1.mentorCourseController.mentorGetAllCourse.bind(course_controller_1.mentorCourseController));
router.get('/get/course', verifyToken_1.default, blocked_1.default, course_controller_1.mentorCourseController.mentorGetCourse.bind(course_controller_1.mentorCourseController));
router.patch('/edit/course', verifyToken_1.default, blocked_1.default, verified_1.default, multer_1.default.fields([
    { name: 'demoVideo', maxCount: 5 },
    { name: 'thumbnail', maxCount: 1 }
]), course_controller_1.mentorCourseController.mentorEditCourse.bind(course_controller_1.mentorCourseController));
router.patch('/unPublish/course', verifyToken_1.default, blocked_1.default, verified_1.default, course_controller_1.mentorCourseController.mentorUnPulishCourse.bind(course_controller_1.mentorCourseController));
router.patch('/publish/course', verifyToken_1.default, blocked_1.default, verified_1.default, course_controller_1.mentorCourseController.mentorPublishCourse.bind(course_controller_1.mentorCourseController));
router.get('/filter/course', verifyToken_1.default, blocked_1.default, course_controller_1.mentorCourseController.mentorFilterCourse.bind(course_controller_1.mentorCourseController));
router.get(`/get/categories`, verifyToken_1.default, blocked_1.default, course_controller_1.mentorCourseController.mentorGetAllCategorise.bind(course_controller_1.mentorCourseController));
//Mentor Chapter Routes
// router.post('/mentor/chapter-upload',authenticateToken, isUserBlocked, isUserVerified, uploadMiddleware.single('chapterVideo'), mentorChapterController.mentorAddChapter.bind(mentorChapterController))
router.post('/mentor/chapter-upload', verifyToken_1.default, blocked_1.default, verified_1.default, chapter_controller_1.mentorChapterController.mentorAddChapter.bind(chapter_controller_1.mentorChapterController));
router.patch('/edit/chapter', verifyToken_1.default, blocked_1.default, verified_1.default, multer_1.default.single('chapterVideo'), chapter_controller_1.mentorChapterController.mentorEditChapter.bind(chapter_controller_1.mentorChapterController));
router.get(`/get/all-chapters`, verifyToken_1.default, blocked_1.default, chapter_controller_1.mentorChapterController.mentorGetAllChapters.bind(chapter_controller_1.mentorChapterController));
//Mentor Quizzz Routes
router.post('/add/quizz', verifyToken_1.default, blocked_1.default, verified_1.default, quizz_controller_1.mentorQuizzController.mentorAddQuizz.bind(quizz_controller_1.mentorQuizzController));
router.get(`/get/all-quizz`, verifyToken_1.default, blocked_1.default, quizz_controller_1.mentorQuizzController.mentorGetAllQuizz.bind(quizz_controller_1.mentorQuizzController));
router.delete('/delete/quizz', verifyToken_1.default, blocked_1.default, verified_1.default, quizz_controller_1.mentorQuizzController.mentorDeleteQuizz.bind(quizz_controller_1.mentorQuizzController));
router.get('/get/wallet', verifyToken_1.default, blocked_1.default, verified_1.default, quizz_controller_1.mentorQuizzController.mentorGetWallet.bind(quizz_controller_1.mentorQuizzController));
//Mentor Chat Routes
router.get('/get/students', verifyToken_1.default, blocked_1.default, verified_1.default, chat_controller_1.mentorchatController.mentorChatGetStudents.bind(chat_controller_1.mentorchatController));
router.get('/get/mentor/messages/:studentId', verifyToken_1.default, blocked_1.default, verified_1.default, chat_controller_1.mentorchatController.mentorGetMessages.bind(chat_controller_1.mentorchatController));
router.post('/save/mentor/message', verifyToken_1.default, blocked_1.default, verified_1.default, chat_controller_1.mentorchatController.mentorSaveMessage.bind(chat_controller_1.mentorchatController));
router.post('/create/mentor/room', verifyToken_1.default, blocked_1.default, verified_1.default, chat_controller_1.mentorchatController.mentorCreateRoom.bind(chat_controller_1.mentorchatController));
router.patch('/delete/mentor/message/everyone/:messageId', verifyToken_1.default, blocked_1.default, verified_1.default, chat_controller_1.mentorchatController.mentorDeleteEveryOne.bind(chat_controller_1.mentorchatController));
router.patch('/delete/mentor/message/me/:messageId', verifyToken_1.default, blocked_1.default, verified_1.default, chat_controller_1.mentorchatController.mentorDeleteForMe.bind(chat_controller_1.mentorchatController));
router.patch('/reset/mentor/count/:studentId', verifyToken_1.default, blocked_1.default, verified_1.default, chat_controller_1.mentorchatController.mentorResetCount.bind(chat_controller_1.mentorchatController));
//Mentor Notification Routes
router.post('/create/mentor/chat/notification', verifyToken_1.default, blocked_1.default, verified_1.default, notification_controller_1.mentorNotificationController.mentorCreateNotification.bind(notification_controller_1.mentorNotificationController));
router.get('/get/mentor/notification/count/:mentorId', notification_controller_1.mentorNotificationController.mentorGetNotificationsCount.bind(notification_controller_1.mentorNotificationController));
router.get('/mentor/notifications/:mentorId', verifyToken_1.default, blocked_1.default, verified_1.default, notification_controller_1.mentorNotificationController.mentorGetNotifications.bind(notification_controller_1.mentorNotificationController));
router.patch('/mentor/notification/seen', verifyToken_1.default, blocked_1.default, verified_1.default, notification_controller_1.mentorNotificationController.mentorGetNotificationsSeen.bind(notification_controller_1.mentorNotificationController));
router.delete('/mentor/delete/notification/:senderId', verifyToken_1.default, blocked_1.default, verified_1.default, notification_controller_1.mentorNotificationController.mentorDeleteNotifications.bind(notification_controller_1.mentorNotificationController));
router.get('/get/student/:studentId', verifyToken_1.default, blocked_1.default, verified_1.default, notification_controller_1.mentorNotificationController.mentorGetStudent.bind(notification_controller_1.mentorNotificationController));
//Mentor Sales Date Routes
router.get('/get/dashboard', verifyToken_1.default, blocked_1.default, verified_1.default, sales_controller_1.mentorSalesController.mentorDashboard.bind(sales_controller_1.mentorSalesController));
router.get('/get/chart/graph/data', verifyToken_1.default, blocked_1.default, verified_1.default, sales_controller_1.mentorSalesController.mentorChartGraph.bind(sales_controller_1.mentorSalesController));
router.get('/get/mentor/report', verifyToken_1.default, blocked_1.default, verified_1.default, sales_controller_1.mentorSalesController.mentorSalesReport.bind(sales_controller_1.mentorSalesController));
// const repository = new MentorRepository()
// const services = new MentorServices(repository)
// const controller = new MentorController(services)
// router.post('/mentor/login', controller.MentorLogin.bind(controller))
// router.post('/mentor/signup', controller.mentorSignUp.bind(controller))
// router.post('/mentor/google-signUp', controller.mentorGoogleSignUp.bind(controller))
// router.post('/mentor/google-login', controller.mentorGoogleLogin.bind(controller))
// router.patch('/mentor/forget-password', controller.mentorForgetPassword.bind(controller))
// router.patch('/mentor/profile-update', authenticateToken, isUserBlocked, isUserVerified, uploadMiddleware.single('profile'), controller.mentorProfileUpdate.bind(controller))
// router.get('/mentor/check',authenticateToken, isUserBlocked, controller.mentorCheck.bind(controller))
// router.patch('/verify', controller.mentorVerify.bind(controller))
// router.get('/mentor/re-verify', authenticateToken, isUserBlocked, controller.mentorReVerify.bind(controller))
//////////////////////////////////// WEEK - 2 ///////////////////////
// // router.post('/mentor/course-upload', authenticateToken, isUserBlocked, isUserVerified, uploadMiddleware.fields([
// //     { name: 'demoVideo', maxCount: 5 },
// //     { name: 'thumbnail', maxCount: 1 }
// // ]), controller.mentorAddCourse.bind(controller));
// router.post('/mentor/course-upload', authenticateToken, isUserBlocked, isUserVerified, controller.mentorAddCourse.bind(controller));
// router.get('/get/all-course',authenticateToken, isUserBlocked, controller.mentorGetAllCourse.bind(controller))
// router.get('/get/course',authenticateToken, isUserBlocked, controller.mentorGetCourse.bind(controller))
// router.patch('/edit/course', authenticateToken, isUserBlocked, isUserVerified, uploadMiddleware.fields([
//     { name: 'demoVideo', maxCount: 5 },
//     { name: 'thumbnail', maxCount: 1 }
// ]), controller.mentorEditCourse.bind(controller))
// router.patch('/unPublish/course',authenticateToken, isUserBlocked, isUserVerified, controller.mentorUnPulishCourse.bind(controller))
// router.patch('/publish/course',authenticateToken, isUserBlocked, isUserVerified, controller.mentorPublishCourse.bind(controller))
// router.get('/filter/course',authenticateToken, isUserBlocked, controller.mentorFilterCourse.bind(controller))
// router.get(`/get/categories`,authenticateToken, isUserBlocked, controller.mentorGetAllCategorise.bind(controller))
// router.post('/mentor/chapter-upload',authenticateToken, isUserBlocked, isUserVerified, uploadMiddleware.single('chapterVideo'), controller.mentorAddChapter.bind(controller))
// router.patch('/edit/chapter',authenticateToken, isUserBlocked, isUserVerified, uploadMiddleware.single('chapterVideo'), controller.mentorEditChapter.bind(controller))
// router.get(`/get/all-chapters`,authenticateToken, isUserBlocked, controller.mentorGetAllChapters.bind(controller))
// router.post('/add/quizz',authenticateToken, isUserBlocked, isUserVerified, controller.mentorAddQuizz.bind(controller))
// router.get(`/get/all-quizz`,authenticateToken, isUserBlocked, controller.mentorGetAllQuizz.bind(controller))
// router.delete('/delete/quizz',authenticateToken, isUserBlocked, isUserVerified, controller.mentorDeleteQuizz.bind(controller))
// router.get('/get/wallet',authenticateToken, isUserBlocked, isUserVerified, controller.mentorGetWallet.bind(controller))
//////////////////////////////////// WEEK - 3 /////////////////////////
// router.get('/get/students', authenticateToken, isUserBlocked, isUserVerified, controller.mentorChatGetStudents.bind(controller))
// router.get('/get/mentor/messages/:studentId', authenticateToken, isUserBlocked, isUserVerified, controller.mentorGetMessages.bind(controller))
// router.post('/save/mentor/message', authenticateToken, isUserBlocked, isUserVerified, controller.mentorSaveMessage.bind(controller))
// router.post('/create/mentor/room', authenticateToken, isUserBlocked, isUserVerified, controller.mentorCreateRoom.bind(controller))
// router.patch('/delete/mentor/message/everyone/:messageId', authenticateToken, isUserBlocked, isUserVerified, controller.mentorDeleteEveryOne.bind(controller))
// router.patch('/reset/mentor/count/:studentId', authenticateToken, isUserBlocked, isUserVerified, controller.mentorResetCount.bind(controller))
//notification
// router.post('/create/mentor/chat/notification', authenticateToken, isUserBlocked, isUserVerified, controller.mentorCreateNotification.bind(controller))
// router.get('/get/mentor/notification/count/:mentorId', controller.mentorGetNotificationsCount.bind(controller))
// router.get('/mentor/notifications/:mentorId', authenticateToken, isUserBlocked, isUserVerified, controller.mentorGetNotifications.bind(controller))
// router.patch('/mentor/notification/seen', authenticateToken, isUserBlocked, isUserVerified, controller.mentorGetNotificationsSeen.bind(controller))
// router.delete('/mentor/delete/notification/:senderId', authenticateToken, isUserBlocked, isUserVerified, controller.mentorDeleteNotifications.bind(controller))
// router.get('/get/student/:studentId', authenticateToken, isUserBlocked, isUserVerified, controller.mentorGetStudent.bind(controller))
////////////////////////////////////////// WEEK - 4 ////////////////////////////////////////////////
// router.get('/get/dashboard', authenticateToken, isUserBlocked, isUserVerified, controller.mentorDashboard.bind(controller))
// router.get('/get/chart/graph/data', authenticateToken, isUserBlocked, isUserVerified, controller.mentorChartGraph.bind(controller))
// router.get('/get/mentor/report', authenticateToken, isUserBlocked, isUserVerified, controller.mentorSalesReport.bind(controller))
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
