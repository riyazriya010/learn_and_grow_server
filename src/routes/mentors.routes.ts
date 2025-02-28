
// import { MentorController } from "../controllers/mentors.controller";

// import MentorRepository from "../repositories/entities/mentor.repository";
// import MentorServices from "../services/business/mentor.services";
// import MentorController from "../controllers/management/mentor.controller";


import { Router } from "express";
import isUserBlocked from "../middleware/blocked";
import authenticateToken from "../middleware/verifyToken";
import isUserVerified from "../middleware/verified";
import uploadMiddleware from "../middleware/multer";
import { mentorAuthController } from "../controllers/management/mentorControllers/auth.controller";
import { mentorCourseController } from "../controllers/management/mentorControllers/course.controller";
import { mentorChapterController } from "../controllers/management/mentorControllers/chapter.controller";
import { mentorchatController } from "../controllers/management/mentorControllers/chat.controller";
import { mentorQuizzController } from "../controllers/management/mentorControllers/quizz.controller";
import { mentorNotificationController } from "../controllers/management/mentorControllers/notification.controller";
import { mentorSalesController } from "../controllers/management/mentorControllers/sales.controller";


// import { MentorController } from "../controllers/mentors.controller";

// import MentorRepository from "../repositories/entities/mentor.repository";
// import MentorServices from "../services/business/mentor.services";
// import MentorController from "../controllers/management/mentor.controller";

const router = Router()
// const mentorController = new MentorController()

//Mentor Auth Routes
router.post('/mentor/login', mentorAuthController.MentorLogin.bind(mentorAuthController))
router.post('/mentor/signup', mentorAuthController.mentorSignUp.bind(mentorAuthController))
router.post('/mentor/google-signUp', mentorAuthController.mentorGoogleSignUp.bind(mentorAuthController))
router.post('/mentor/google-login', mentorAuthController.mentorGoogleLogin.bind(mentorAuthController))
router.patch('/mentor/forget-password', mentorAuthController.mentorForgetPassword.bind(mentorAuthController))
router.patch('/mentor/profile-update', authenticateToken, isUserBlocked, isUserVerified, uploadMiddleware.single('profile'), mentorAuthController.mentorProfileUpdate.bind(mentorAuthController))
router.get('/mentor/check',authenticateToken, isUserBlocked, mentorAuthController.mentorCheck.bind(mentorAuthController))
router.patch('/verify', mentorAuthController.mentorVerify.bind(mentorAuthController))
router.get('/mentor/re-verify', authenticateToken, isUserBlocked, mentorAuthController.mentorReVerify.bind(mentorAuthController))
router.post('/mentor/generate-presigned-url',authenticateToken, isUserBlocked, isUserVerified, mentorAuthController.getSignedUrl.bind(mentorAuthController))
router.post('/mentor/logout',authenticateToken, isUserBlocked, isUserVerified, mentorAuthController.mentorLogout.bind(mentorAuthController))


//Mentor Course Routes
// router.post('/mentor/course-upload', authenticateToken, isUserBlocked, isUserVerified, uploadMiddleware.fields([
//     { name: 'demoVideo', maxCount: 5 },
//     { name: 'thumbnail', maxCount: 1 }
// ]), controller.mentorAddCourse.bind(controller));
router.post('/mentor/course-upload', authenticateToken, isUserBlocked, isUserVerified, mentorCourseController.mentorAddCourse.bind(mentorCourseController));
router.get('/get/all-course',authenticateToken, isUserBlocked, mentorCourseController.mentorGetAllCourse.bind(mentorCourseController))
router.get('/get/course',authenticateToken, isUserBlocked, mentorCourseController.mentorGetCourse.bind(mentorCourseController))
router.patch('/edit/course', authenticateToken, isUserBlocked, isUserVerified, uploadMiddleware.fields([
    { name: 'demoVideo', maxCount: 5 },
    { name: 'thumbnail', maxCount: 1 }
]), mentorCourseController.mentorEditCourse.bind(mentorCourseController))
router.patch('/unPublish/course',authenticateToken, isUserBlocked, isUserVerified, mentorCourseController.mentorUnPulishCourse.bind(mentorCourseController))
router.patch('/publish/course',authenticateToken, isUserBlocked, isUserVerified, mentorCourseController.mentorPublishCourse.bind(mentorCourseController))
router.get('/filter/course',authenticateToken, isUserBlocked, mentorCourseController.mentorFilterCourse.bind(mentorCourseController))
router.get(`/get/categories`,authenticateToken, isUserBlocked, mentorCourseController.mentorGetAllCategorise.bind(mentorCourseController))


//Mentor Chapter Routes
// router.post('/mentor/chapter-upload',authenticateToken, isUserBlocked, isUserVerified, uploadMiddleware.single('chapterVideo'), mentorChapterController.mentorAddChapter.bind(mentorChapterController))
router.post('/mentor/chapter-upload',authenticateToken, isUserBlocked, isUserVerified, mentorChapterController.mentorAddChapter.bind(mentorChapterController))
// router.patch('/edit/chapter',authenticateToken, isUserBlocked, isUserVerified, uploadMiddleware.single('chapterVideo'), mentorChapterController.mentorEditChapter.bind(mentorChapterController))
router.patch('/edit/chapter',authenticateToken, isUserBlocked, isUserVerified, mentorChapterController.mentorEditChapter.bind(mentorChapterController))
router.get(`/get/all-chapters`,authenticateToken, isUserBlocked, mentorChapterController .mentorGetAllChapters.bind(mentorChapterController))


//Mentor Quizzz Routes
router.post('/add/quizz',authenticateToken, isUserBlocked, isUserVerified, mentorQuizzController.mentorAddQuizz.bind(mentorQuizzController))
router.get(`/get/all-quizz`,authenticateToken, isUserBlocked, mentorQuizzController.mentorGetAllQuizz.bind(mentorQuizzController))
router.delete('/delete/quizz',authenticateToken, isUserBlocked, isUserVerified, mentorQuizzController.mentorDeleteQuizz.bind(mentorQuizzController))
router.get('/get/wallet',authenticateToken, isUserBlocked, isUserVerified, mentorQuizzController.mentorGetWallet.bind(mentorQuizzController))



//Mentor Chat Routes
router.get('/get/students', authenticateToken, isUserBlocked, isUserVerified, mentorchatController.mentorChatGetStudents.bind(mentorchatController))
router.get('/get/mentor/messages/:studentId', authenticateToken, isUserBlocked, isUserVerified, mentorchatController.mentorGetMessages.bind(mentorchatController))
router.post('/save/mentor/message', authenticateToken, isUserBlocked, isUserVerified, mentorchatController.mentorSaveMessage.bind(mentorchatController))
router.post('/create/mentor/room', authenticateToken, isUserBlocked, isUserVerified, mentorchatController.mentorCreateRoom.bind(mentorchatController))
router.patch('/delete/mentor/message/everyone/:messageId', authenticateToken, isUserBlocked, isUserVerified, mentorchatController.mentorDeleteEveryOne.bind(mentorchatController))
router.patch('/delete/mentor/message/me/:messageId', authenticateToken, isUserBlocked, isUserVerified, mentorchatController.mentorDeleteForMe.bind(mentorchatController))
router.patch('/reset/mentor/count/:studentId', authenticateToken, isUserBlocked, isUserVerified, mentorchatController.mentorResetCount.bind(mentorchatController))


//Mentor Notification Routes
router.post('/create/mentor/chat/notification', authenticateToken, isUserBlocked, isUserVerified, mentorNotificationController.mentorCreateNotification.bind(mentorNotificationController))
router.get('/get/mentor/notification/count/:mentorId', mentorNotificationController.mentorGetNotificationsCount.bind(mentorNotificationController))
router.get('/mentor/notifications/:mentorId', authenticateToken, isUserBlocked, isUserVerified, mentorNotificationController.mentorGetNotifications.bind(mentorNotificationController))
router.patch('/mentor/notification/seen', authenticateToken, isUserBlocked, isUserVerified, mentorNotificationController.mentorGetNotificationsSeen.bind(mentorNotificationController))
router.delete('/mentor/delete/notification/:senderId', authenticateToken, isUserBlocked, isUserVerified, mentorNotificationController.mentorDeleteNotifications.bind(mentorNotificationController))
router.get('/get/student/:studentId', authenticateToken, isUserBlocked, isUserVerified, mentorNotificationController.mentorGetStudent.bind(mentorNotificationController))


//Mentor Sales Date Routes
router.get('/get/dashboard', authenticateToken, isUserBlocked, isUserVerified, mentorSalesController.mentorDashboard.bind(mentorSalesController))
router.get('/get/chart/graph/data', authenticateToken, isUserBlocked, isUserVerified, mentorSalesController.mentorChartGraph.bind(mentorSalesController))
router.get('/get/mentor/report', authenticateToken, isUserBlocked, isUserVerified, mentorSalesController.mentorSalesReport.bind(mentorSalesController))





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




const mentorRoutes = router
export default mentorRoutes;













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







