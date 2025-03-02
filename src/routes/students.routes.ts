
// import UserController from "../controllers/students.controller";
import { registerRoutes, RouteConfig } from "./routeUtils";


import { Router } from "express";
import authenticateToken from "../middleware/verifyToken";
import isUserBlocked from "../middleware/blocked";
import isUserVerified from "../middleware/verified";
import uploadMiddleware from "../middleware/multer";
import { studentAuthController } from "../controllers/management/studentControllers/auth.controller";
import { studentCourseController } from "../controllers/management/studentControllers/course.controller";
import { studentCertificateController } from "../controllers/management/studentControllers/certificate.controller";
import { studentChatController } from "../controllers/management/studentControllers/chat.controller";
import { studentNotificationController } from "../controllers/management/studentControllers/notification.controller";
import { studentRewardController } from "../controllers/management/studentControllers/badge.controller";
import authenticateBlackList from "../middleware/authenticate";


const router = Router();


//Auth Routes
router.post('/student/login', studentAuthController.studentLogin.bind(studentAuthController))
router.post('/student/signup', studentAuthController.studentSignUp.bind(studentAuthController))
router.post('/student/google-signUp', studentAuthController.studentGoogleSignUp.bind(studentAuthController))
router.post('/student/google-login', studentAuthController.studentGoogleLogin.bind(studentAuthController))
router.patch('/student/forget-password', studentAuthController.studentForgetPassword.bind(studentAuthController))
router.patch('/verify', studentAuthController.studentVerify.bind(studentAuthController))
router.patch('/student/profile-update', authenticateBlackList, authenticateToken, isUserBlocked, isUserVerified, studentAuthController.studentProfleUpdate.bind(studentAuthController))
router.get('/student/re-verify', authenticateBlackList, authenticateToken, isUserBlocked, studentAuthController.studentReVerify.bind(studentAuthController))
router.get('/student/check', authenticateBlackList, authenticateToken, isUserBlocked, studentAuthController.studentCheck.bind(studentAuthController))
router.post('/student/generate-presigned-url', authenticateBlackList, authenticateToken, isUserBlocked, isUserVerified, studentAuthController.getSignedUrl.bind(studentAuthController))
router.post('/student/logout', studentAuthController.studentLogout.bind(studentAuthController))


//Courses Routes
router.get('/get/all-course', studentCourseController.studentGetAllCourses.bind(studentCourseController))
router.get('/filter/data', studentCourseController.studentCourseFilterData.bind(studentCourseController))
router.get('/get/course', studentCourseController.studentGetCourse.bind(studentCourseController))

router.get('/get/course/play', authenticateBlackList, authenticateToken, isUserBlocked, studentCourseController.studentGetCoursePlay.bind(studentCourseController))
router.post('/payment', authenticateBlackList, authenticateToken, isUserBlocked, studentCourseController.studentBuyCourse.bind(studentCourseController))
router.get('/get/buyedCourses', authenticateBlackList, authenticateToken, isUserBlocked, studentCourseController.studentBuyedCourses.bind(studentCourseController))
router.get('/course-play', authenticateBlackList, authenticateToken, isUserBlocked, studentCourseController.studentCoursePlay.bind(studentCourseController))
router.patch('/chapter-end', authenticateBlackList, authenticateToken, isUserBlocked, studentCourseController.studentChapterVideoEnd.bind(studentCourseController))
// check verify before buy the course
router.get('/check/verify', authenticateBlackList, authenticateToken, isUserBlocked, isUserVerified, studentCourseController.studentIsVerified.bind(studentCourseController))
router.get('/complete/course', authenticateBlackList, authenticateToken, isUserBlocked, studentCourseController.studentCompleteCourse.bind(studentCourseController))
router.get('/get/quizz', authenticateBlackList, authenticateToken, isUserBlocked, studentCourseController.studentQuizz.bind(studentCourseController))
router.get('/already/buyed/course/:courseId',authenticateToken, isUserBlocked, isUserVerified, studentCourseController.studentCheckAlreadyBuyed.bind(studentCourseController))


//Certificate Routes
router.get('/get/certificate', authenticateBlackList, authenticateToken, isUserBlocked, studentCertificateController.studentGeCerfiticate.bind(studentCertificateController))
router.post('/create/certificate', authenticateBlackList, authenticateToken, isUserBlocked, studentCertificateController.studentCreateCertificate.bind(studentCertificateController))
router.get('/get/certificates', authenticateBlackList, authenticateToken, isUserBlocked, studentCertificateController.studentGetAllCertificates.bind(studentCertificateController))


//Chat Routes
router.get('/get/mentors', authenticateBlackList, authenticateToken, isUserBlocked, isUserVerified, studentChatController.studentChatGetMentors.bind(studentChatController))
router.post('/create/room', authenticateBlackList, authenticateToken, isUserBlocked, isUserVerified, studentChatController.studentCreateRoom.bind(studentChatController))
router.post('/save/message', authenticateBlackList, authenticateToken, isUserBlocked, isUserVerified, studentChatController.studentSaveMessage.bind(studentChatController))
router.get('/get/messages/:mentorId', authenticateBlackList, authenticateToken, isUserBlocked, isUserVerified, studentChatController.studentGetMessages.bind(studentChatController))
router.patch('/delete/message/everyone/:messageId', authenticateBlackList, authenticateToken, isUserBlocked, isUserVerified, studentChatController.studentDeleteEveryOne.bind(studentChatController))
router.patch('/delete/message/me/:messageId', authenticateBlackList, authenticateToken, isUserBlocked, isUserVerified, studentChatController.studentDeleteForMe.bind(studentChatController))
router.patch('/reset/count/:mentorId', authenticateBlackList, authenticateToken, isUserBlocked, isUserVerified, studentChatController.studentResetCount.bind(studentChatController))


//Notifications Routes
router.post('/create/chat/notification', authenticateBlackList, authenticateToken, isUserBlocked, isUserVerified, studentNotificationController.studentCreateNotification.bind(studentNotificationController))
router.get('/get/student/notifications/:studentId', authenticateBlackList, authenticateToken, isUserBlocked, isUserVerified, studentNotificationController.studentGetNotifications.bind(studentNotificationController))
router.get('/get/student/notification/count/:studentId', authenticateBlackList, authenticateToken, isUserBlocked, isUserVerified, studentNotificationController.studentGetNotificationsCount.bind(studentNotificationController))
router.patch('/student/notification/seen', authenticateBlackList, authenticateToken, isUserBlocked, isUserVerified, studentNotificationController.studentGetNotificationsSeen.bind(studentNotificationController))
router.delete('/student/delete/notification/:senderId', authenticateBlackList, authenticateToken, isUserBlocked, isUserVerified, studentNotificationController.studentDeleteNotifications.bind(studentNotificationController))
router.get('/get/mentor/:mentorId',authenticateBlackList, authenticateToken, isUserBlocked, isUserVerified, studentNotificationController.studentGetMentor.bind(studentNotificationController))
router.get('/get/badges', authenticateBlackList, authenticateToken, isUserBlocked, isUserVerified, studentNotificationController.studentGetBadges.bind(studentNotificationController))

//rewards Routes
router.get('/convert-badge/money/:badgeId', authenticateBlackList, authenticateToken, isUserBlocked, isUserVerified, studentRewardController.studentRewardConvert.bind(studentRewardController))
router.get('/get/student/wallet', authenticateBlackList, authenticateToken, isUserBlocked, isUserVerified, studentRewardController.studentWallet.bind(studentRewardController))
router.get('/get/wallet/balance', authenticateBlackList, authenticateToken, isUserBlocked, isUserVerified, studentRewardController.studentWalletBalance.bind(studentRewardController))
router.post('/buy/course/wallet', authenticateBlackList, authenticateToken, isUserBlocked, isUserVerified, studentRewardController.studentwalletBuyCourse.bind(studentRewardController))




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



const userRoutes = router
export default userRoutes;














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