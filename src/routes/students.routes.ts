import { Router } from "express";
import UserController from "../controllers/students.controller";
import authenticateToken from "../middleware/verifyToken";
import isUserBlocked from "../middleware/blocked";
import isUserVerified from "../middleware/verified";
import uploadMiddleware from "../middleware/multer";
import { registerRoutes, RouteConfig } from "./routeUtils";
import StudentRepository from "../repositories/entities/student.repository";
import StudentServices from "../services/business/student.services";
import StudentController from "../controllers/management/student.controller";

// const userController = new UserController();

const router = Router();

const repository = new StudentRepository()
const services = new StudentServices(repository)
const controller = new StudentController(services)


/////////////////////////////// WEEK - 1 /////////////////////////////

router.post('/student/login', controller.studentLogin.bind(controller));
router.post('/student/signup', controller.studentSignUp.bind(controller));
router.post('/student/google-signUp', controller.studentGoogleSignUp.bind(controller));
router.post('/student/google-login', controller.studentGoogleLogin.bind(controller));
router.patch('/student/forget-password', controller.studentForgetPassword.bind(controller));
router.patch('/verify', controller.studentVerify.bind(controller));
router.patch('/student/profile-update', authenticateToken, isUserBlocked, isUserVerified, uploadMiddleware.single('profile'), controller.studentProfleUpdate.bind(controller))
router.get('/student/re-verify', authenticateToken, isUserBlocked, controller.studentReVerify.bind(controller));
router.get('/student/check', authenticateToken, isUserBlocked, controller.studentCheck.bind(controller));

/////////////////////////////// WEEK - 2 /////////////////////////////

router.get('/get/all-course', controller.studentGetAllCourses.bind(controller))
router.get('/filter/data', controller.studentCourseFilterData.bind(controller))
router.get('/get/course', controller.studentGetCourse.bind(controller))

router.get('/get/course/play', authenticateToken, isUserBlocked, controller.studentGetCoursePlay.bind(controller))
router.post('/payment', authenticateToken, isUserBlocked, controller.studentBuyCourse.bind(controller))
router.get('/get/buyedCourses', authenticateToken, isUserBlocked, controller.studentBuyedCourses.bind(controller))
router.get('/course-play', authenticateToken, isUserBlocked, controller.studentCoursePlay.bind(controller))
router.patch('/chapter-end', authenticateToken, isUserBlocked, controller.studentChapterVideoEnd.bind(controller))
router.get('/get/certificate', authenticateToken, isUserBlocked, controller.studentGeCerfiticate.bind(controller))
router.get('/complete/course', authenticateToken, isUserBlocked, controller.studentCompleteCourse.bind(controller))
router.get('/get/quizz', authenticateToken, isUserBlocked, controller.studentQuizz.bind(controller))
router.post('/create/certificate', authenticateToken, isUserBlocked, controller.studentCreateCertificate.bind(controller))
router.get('/get/certificates', authenticateToken, isUserBlocked, controller.studentGetAllCertificates.bind(controller))
// check verify before buy the course
router.get('/check/verify', authenticateToken, isUserBlocked, isUserVerified, controller.studentIsVerified.bind(controller))


/////////////////////////////// WEEK - 3 /////////////////////////////


router.get('/get/users', authenticateToken, isUserBlocked, isUserVerified, controller.studentChatGetUsers.bind(controller))
router.post('/create/room', authenticateToken, isUserBlocked, isUserVerified, controller.studentCreateRoom.bind(controller))
router.get('/get/message/:roomId', authenticateToken, isUserBlocked, isUserVerified, controller.studentGetMessages.bind(controller))
router.post('/save/message', authenticateToken, isUserBlocked, isUserVerified, controller.studentSaveMessage.bind(controller))



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