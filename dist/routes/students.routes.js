"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const verifyToken_1 = __importDefault(require("../middleware/verifyToken"));
const blocked_1 = __importDefault(require("../middleware/blocked"));
const verified_1 = __importDefault(require("../middleware/verified"));
const auth_controller_1 = require("../controllers/management/studentControllers/auth.controller");
const course_controller_1 = require("../controllers/management/studentControllers/course.controller");
const certificate_controller_1 = require("../controllers/management/studentControllers/certificate.controller");
const chat_controller_1 = require("../controllers/management/studentControllers/chat.controller");
const notification_controller_1 = require("../controllers/management/studentControllers/notification.controller");
const router = (0, express_1.Router)();
//Auth Routes
router.post('/student/login', auth_controller_1.studentAuthController.studentLogin.bind(auth_controller_1.studentAuthController));
router.post('/student/signup', auth_controller_1.studentAuthController.studentSignUp.bind(auth_controller_1.studentAuthController));
router.post('/student/google-signUp', auth_controller_1.studentAuthController.studentGoogleSignUp.bind(auth_controller_1.studentAuthController));
router.post('/student/google-login', auth_controller_1.studentAuthController.studentGoogleLogin.bind(auth_controller_1.studentAuthController));
router.patch('/student/forget-password', auth_controller_1.studentAuthController.studentForgetPassword.bind(auth_controller_1.studentAuthController));
router.patch('/verify', auth_controller_1.studentAuthController.studentVerify.bind(auth_controller_1.studentAuthController));
router.patch('/student/profile-update', verifyToken_1.default, blocked_1.default, verified_1.default, auth_controller_1.studentAuthController.studentProfleUpdate.bind(auth_controller_1.studentAuthController));
router.get('/student/re-verify', verifyToken_1.default, blocked_1.default, auth_controller_1.studentAuthController.studentReVerify.bind(auth_controller_1.studentAuthController));
router.get('/student/check', verifyToken_1.default, blocked_1.default, auth_controller_1.studentAuthController.studentCheck.bind(auth_controller_1.studentAuthController));
router.post('/student/generate-presigned-url', verifyToken_1.default, blocked_1.default, verified_1.default, auth_controller_1.studentAuthController.getSignedUrl.bind(auth_controller_1.studentAuthController));
//Courses Routes
router.get('/get/all-course', course_controller_1.studentCourseController.studentGetAllCourses.bind(course_controller_1.studentCourseController));
router.get('/filter/data', course_controller_1.studentCourseController.studentCourseFilterData.bind(course_controller_1.studentCourseController));
router.get('/get/course', course_controller_1.studentCourseController.studentGetCourse.bind(course_controller_1.studentCourseController));
router.get('/get/course/play', verifyToken_1.default, blocked_1.default, course_controller_1.studentCourseController.studentGetCoursePlay.bind(course_controller_1.studentCourseController));
router.post('/payment', verifyToken_1.default, blocked_1.default, course_controller_1.studentCourseController.studentBuyCourse.bind(course_controller_1.studentCourseController));
router.get('/get/buyedCourses', verifyToken_1.default, blocked_1.default, course_controller_1.studentCourseController.studentBuyedCourses.bind(course_controller_1.studentCourseController));
router.get('/course-play', verifyToken_1.default, blocked_1.default, course_controller_1.studentCourseController.studentCoursePlay.bind(course_controller_1.studentCourseController));
router.patch('/chapter-end', verifyToken_1.default, blocked_1.default, course_controller_1.studentCourseController.studentChapterVideoEnd.bind(course_controller_1.studentCourseController));
// check verify before buy the course
router.get('/check/verify', verifyToken_1.default, blocked_1.default, verified_1.default, course_controller_1.studentCourseController.studentIsVerified.bind(course_controller_1.studentCourseController));
router.get('/complete/course', verifyToken_1.default, blocked_1.default, course_controller_1.studentCourseController.studentCompleteCourse.bind(course_controller_1.studentCourseController));
router.get('/get/quizz', verifyToken_1.default, blocked_1.default, course_controller_1.studentCourseController.studentQuizz.bind(course_controller_1.studentCourseController));
router.get('/already/buyed/course/:courseId', verifyToken_1.default, blocked_1.default, verified_1.default, course_controller_1.studentCourseController.studentCheckAlreadyBuyed.bind(course_controller_1.studentCourseController));
//Certificate Routes
router.get('/get/certificate', verifyToken_1.default, blocked_1.default, certificate_controller_1.studentCertificateController.studentGeCerfiticate.bind(certificate_controller_1.studentCertificateController));
router.post('/create/certificate', verifyToken_1.default, blocked_1.default, certificate_controller_1.studentCertificateController.studentCreateCertificate.bind(certificate_controller_1.studentCertificateController));
router.get('/get/certificates', verifyToken_1.default, blocked_1.default, certificate_controller_1.studentCertificateController.studentGetAllCertificates.bind(certificate_controller_1.studentCertificateController));
//Chat Routes
router.get('/get/mentors', verifyToken_1.default, blocked_1.default, verified_1.default, chat_controller_1.studentChatController.studentChatGetMentors.bind(chat_controller_1.studentChatController));
router.post('/create/room', verifyToken_1.default, blocked_1.default, verified_1.default, chat_controller_1.studentChatController.studentCreateRoom.bind(chat_controller_1.studentChatController));
router.post('/save/message', verifyToken_1.default, blocked_1.default, verified_1.default, chat_controller_1.studentChatController.studentSaveMessage.bind(chat_controller_1.studentChatController));
router.get('/get/messages/:mentorId', verifyToken_1.default, blocked_1.default, verified_1.default, chat_controller_1.studentChatController.studentGetMessages.bind(chat_controller_1.studentChatController));
router.patch('/delete/message/everyone/:messageId', verifyToken_1.default, blocked_1.default, verified_1.default, chat_controller_1.studentChatController.studentDeleteEveryOne.bind(chat_controller_1.studentChatController));
router.patch('/delete/message/me/:messageId', verifyToken_1.default, blocked_1.default, verified_1.default, chat_controller_1.studentChatController.studentDeleteForMe.bind(chat_controller_1.studentChatController));
router.patch('/reset/count/:mentorId', verifyToken_1.default, blocked_1.default, verified_1.default, chat_controller_1.studentChatController.studentResetCount.bind(chat_controller_1.studentChatController));
//Notifications Routes
router.post('/create/chat/notification', verifyToken_1.default, blocked_1.default, verified_1.default, notification_controller_1.studentNotificationController.studentCreateNotification.bind(notification_controller_1.studentNotificationController));
router.get('/get/student/notifications/:studentId', verifyToken_1.default, blocked_1.default, verified_1.default, notification_controller_1.studentNotificationController.studentGetNotifications.bind(notification_controller_1.studentNotificationController));
router.get('/get/student/notification/count/:studentId', verifyToken_1.default, blocked_1.default, verified_1.default, notification_controller_1.studentNotificationController.studentGetNotificationsCount.bind(notification_controller_1.studentNotificationController));
router.patch('/student/notification/seen', verifyToken_1.default, blocked_1.default, verified_1.default, notification_controller_1.studentNotificationController.studentGetNotificationsSeen.bind(notification_controller_1.studentNotificationController));
router.delete('/student/delete/notification/:senderId', verifyToken_1.default, blocked_1.default, verified_1.default, notification_controller_1.studentNotificationController.studentDeleteNotifications.bind(notification_controller_1.studentNotificationController));
router.get('/get/mentor/:mentorId', verifyToken_1.default, blocked_1.default, verified_1.default, notification_controller_1.studentNotificationController.studentGetMentor.bind(notification_controller_1.studentNotificationController));
router.get('/get/badges', verifyToken_1.default, blocked_1.default, verified_1.default, notification_controller_1.studentNotificationController.studentGetBadges.bind(notification_controller_1.studentNotificationController));
// const repository = new StudentRepository()
// const services = new StudentServices(repository)
// const controller = new StudentController(services)
/////////////////////////////// WEEK - 1 /////////////////////////////
// router.post('/student/login', controller.studentLogin.bind(controller));
// router.post('/student/signup', controller.studentSignUp.bind(controller));
// router.post('/student/google-signUp', controller.studentGoogleSignUp.bind(controller));
// router.post('/student/google-login', controller.studentGoogleLogin.bind(controller));
// router.patch('/student/forget-password', controller.studentForgetPassword.bind(controller));
// router.patch('/verify', controller.studentVerify.bind(controller));
// router.patch('/student/profile-update', authenticateToken, isUserBlocked, isUserVerified, uploadMiddleware.single('profile'), controller.studentProfleUpdate.bind(controller))
// router.patch('/student/profile-update', authenticateToken, isUserBlocked, isUserVerified, controller.studentProfleUpdate.bind(controller))
// router.get('/student/re-verify', authenticateToken, isUserBlocked, controller.studentReVerify.bind(controller));
// router.get('/student/check', authenticateToken, isUserBlocked, controller.studentCheck.bind(controller));
/////////////////////////////// WEEK - 2 /////////////////////////////
// router.get('/get/all-course', controller.studentGetAllCourses.bind(controller))
// router.get('/filter/data', controller.studentCourseFilterData.bind(controller))
// router.get('/get/course', controller.studentGetCourse.bind(controller))
// router.get('/get/course/play', authenticateToken, isUserBlocked, controller.studentGetCoursePlay.bind(controller))
// router.post('/payment', authenticateToken, isUserBlocked, controller.studentBuyCourse.bind(controller))
// router.get('/get/buyedCourses', authenticateToken, isUserBlocked, controller.studentBuyedCourses.bind(controller))
// router.get('/course-play', authenticateToken, isUserBlocked, controller.studentCoursePlay.bind(controller))
// router.patch('/chapter-end', authenticateToken, isUserBlocked, controller.studentChapterVideoEnd.bind(controller))
// router.get('/complete/course', authenticateToken, isUserBlocked, controller.studentCompleteCourse.bind(controller))
// check verify before buy the course
// router.get('/check/verify', authenticateToken, isUserBlocked, isUserVerified, controller.studentIsVerified.bind(controller))
// router.get('/get/quizz', authenticateToken, isUserBlocked, controller.studentQuizz.bind(controller))
//certificates
// router.get('/get/certificate', authenticateToken, isUserBlocked, controller.studentGeCerfiticate.bind(controller))
// router.post('/create/certificate', authenticateToken, isUserBlocked, controller.studentCreateCertificate.bind(controller))
// router.get('/get/certificates', authenticateToken, isUserBlocked, controller.studentGetAllCertificates.bind(controller))
/////////////////////////////// WEEK - 3 /////////////////////////////
// router.get('/get/mentors/', authenticateToken, isUserBlocked, isUserVerified, controller.studentChatGetMentors.bind(controller))
// router.post('/create/room', authenticateToken, isUserBlocked, isUserVerified, controller.studentCreateRoom.bind(controller))
// router.post('/save/message', authenticateToken, isUserBlocked, isUserVerified, controller.studentSaveMessage.bind(controller))
// router.get('/get/messages/:mentorId', authenticateToken, isUserBlocked, isUserVerified, controller.studentGetMessages.bind(controller))
// router.patch('/delete/message/everyone/:messageId', authenticateToken, isUserBlocked, isUserVerified, controller.studentDeleteEveryOne.bind(controller))
// router.patch('/delete/message/me/:messageId', authenticateToken, isUserBlocked, isUserVerified, controller.studentDeleteForMe.bind(controller))
// router.patch('/reset/count/:mentorId', authenticateToken, isUserBlocked, isUserVerified, controller.studentResetCount.bind(controller))
//Notification
// router.post('/create/chat/notification', authenticateToken, isUserBlocked, isUserVerified, controller.studentCreateNotification.bind(controller))
// router.get('/get/student/notifications/:studentId', authenticateToken, isUserBlocked, isUserVerified, controller.studentGetNotifications.bind(controller))
// router.get('/get/student/notification/count/:studentId', controller.studentGetNotificationsCount.bind(controller))
// router.patch('/student/notification/seen', authenticateToken, isUserBlocked, isUserVerified, controller.studentGetNotificationsSeen.bind(controller))
// router.delete('/student/delete/notification/:senderId', authenticateToken, isUserBlocked, isUserVerified, controller.studentDeleteNotifications.bind(controller))
// router.get('/get/mentor/:mentorId', authenticateToken, isUserBlocked, isUserVerified, controller.studentGetMentor.bind(controller))
// router.get('/get/badges', authenticateToken, isUserBlocked, isUserVerified, controller.studentGetBadges.bind(controller))
const userRoutes = router;
exports.default = userRoutes;
/* ------------------------------------ WEEK - 1 ---------------------------------*/
// router.post('/student/login', userController.studentLogin.bind(userController));
// router.post('/student/signup', userController.studentSignup.bind(userController));
// router.post('/student/google-signUp', userController.studentGoogleSignIn.bind(userController));
// router.post('/student/google-login', userController.studentGoogleLogin.bind(userController));
// router.patch('/student/forget-password', userController.forgetPassword.bind(userController));
// router.patch('/verify', userController.verifyStudent.bind(userController));
// router.patch('/student/profile-update', authenticateToken, isUserBlocked, isUserVerified, uploadMiddleware.single('profile'), userController.profileUpdate.bind(userController))
// router.get('/student/re-verify', authenticateToken, isUserBlocked, userController.studentReVerify.bind(userController));
// router.get('/student/check', authenticateToken, isUserBlocked, userController.checkStudent.bind(userController));
/* ------------------------------------ WEEK - 2 ---------------------------------*/
// unprotected route
// router.get('/get/course', userController.getCourse.bind(userController))
// router.get('/get/all-course', userController.getAllCourses.bind(userController))
// router.get('/filter/data', userController.filterData.bind(userController))
//protected route
// router.get('/get/course/play', authenticateToken, isUserBlocked, userController.getCoursePlay.bind(userController))
// router.post('/payment', authenticateToken, isUserBlocked, userController.buyCourse.bind(userController))
// router.get('/get/buyedCourses', authenticateToken, isUserBlocked, userController.getBuyedCourses.bind(userController))
// router.get('/course-play', authenticateToken, isUserBlocked, userController.coursePlay.bind(userController))
// router.patch('/chapter-end', authenticateToken, isUserBlocked, userController.chapterVideoEnd.bind(userController))
// router.get('/get/certificate', authenticateToken, isUserBlocked, userController.getCertificate.bind(userController))
// router.get('/get/quizz', authenticateToken, isUserBlocked, userController.getQuizz.bind(userController))
// router.get('/complete/course', authenticateToken, isUserBlocked, userController.completeCourse.bind(userController))
// router.get('/get/certificates', authenticateToken, isUserBlocked, userController.getCertificates.bind(userController))
// router.post('/create/certificate', authenticateToken, isUserBlocked, userController.createCertificate.bind(userController))
// // check verify before buy the course
// router.get('/check/verify', authenticateToken, isUserBlocked, isUserVerified, userController.isVerified.bind(userController))
/* ------------------------------------ WEEK - 3 ---------------------------------*/
// /* ------------------------------------ WEEK - 1 ---------------------------------*/
// const week1Routes: RouteConfig[] = [
//     { method: 'post', path: '/student/login', middlewares: [], handler: userController.studentLogin.bind(userController) },
//     { method: 'post', path: '/student/signup', middlewares: [], handler: userController.studentSignup.bind(userController) },
//     { method: 'post', path: '/student/google-signUp', middlewares: [], handler: userController.studentGoogleSignIn.bind(userController) },
//     { method: 'post', path: '/student/google-login', middlewares: [], handler: userController.studentGoogleLogin.bind(userController) },
//     { method: 'patch', path: '/student/forget-password', middlewares: [], handler: userController.forgetPassword.bind(userController) },
//     { method: 'patch', path: '/student/profile-update', middlewares: [authenticateToken, isUserBlocked, isUserBlocked, uploadMiddleware.single('profile')], handler: userController.profileUpdate.bind(userController) },
//     { method: 'patch', path: '/verify', middlewares: [], handler: userController.verifyStudent.bind(userController) },
//     { method: 'get', path: '/student/re-verify', middlewares: [authenticateToken, isUserBlocked], handler: userController.studentReVerify.bind(userController) },
//     { method: 'get', path: '/student/check', middlewares: [], handler: userController.checkStudent.bind(userController) }
// ];
// /* ------------------------------------ WEEK - 2 ---------------------------------*/
// const week2Routes: RouteConfig[] = [
//     { method: 'get', path: '/get/all-course', middlewares: [], handler: userController.getAllCourses.bind(userController) },
//     { method: 'get', path: '/get/course', middlewares: [], handler: userController.getCourse.bind(userController) },
//     { method: 'get', path: '/get/course/play', middlewares: [], handler: userController.getCoursePlay.bind(userController) },
//     { method: 'get', path: '/filter/data', middlewares: [], handler: userController.filterData.bind(userController) },
//     { method: 'post', path: '/payment', middlewares: [], handler: userController.buyCourse.bind(userController) },
//     { method: 'get', path: '/get/buyedCourses', middlewares: [], handler: userController.getBuyedCourses.bind(userController) },
//     { method: 'get', path: '/course-play', middlewares: [], handler: userController.coursePlay.bind(userController) },
//     { method: 'patch', path: '/chapter-end', middlewares: [], handler: userController.chapterVideoEnd.bind(userController) },
//     { method: 'get', path: '/get/certificate', middlewares: [], handler: userController.getCertificate.bind(userController) },
//     { method: 'get', path: '/get/quizz', middlewares: [], handler: userController.getQuizz.bind(userController) },
//     { method: 'get', path: '/complete/course', middlewares: [], handler: userController.completeCourse.bind(userController) },
//     { method: 'get', path: '/get/certificates', middlewares: [], handler: userController.getCertificates.bind(userController) },
//     { method: 'post', path: '/create/certificate', middlewares: [], handler: userController.createCertificate.bind(userController) },
//     { method: 'get', path: '/check/verify', middlewares: [authenticateToken, isUserVerified], handler: userController.isVerified.bind(userController) }
// ];
// registerRoutes(router, [...week1Routes, ...week2Routes])
