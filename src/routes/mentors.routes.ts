import { Router } from "express";
// import { MentorController } from "../controllers/mentors.controller";
import isUserBlocked from "../middleware/blocked";
import authenticateToken from "../middleware/verifyToken";
import isUserVerified from "../middleware/verified";
import uploadMiddleware from "../middleware/multer";
import MentorRepository from "../repositories/entities/mentor.repository";
import MentorServices from "../services/business/mentor.services";
import MentorController from "../controllers/management/mentor.controller";

const router = Router()
// const mentorController = new MentorController()


const repository = new MentorRepository()
const services = new MentorServices(repository)
const controller = new MentorController(services)




/////////////////////////////////// WEEK - 1 //////////////////////

router.post('/mentor/login', controller.MentorLogin.bind(controller))
router.post('/mentor/signup', controller.mentorSignUp.bind(controller))
router.post('/mentor/google-signUp', controller.mentorGoogleSignUp.bind(controller))
router.post('/mentor/google-login', controller.mentorGoogleLogin.bind(controller))
router.patch('/mentor/forget-password', controller.mentorForgetPassword.bind(controller))
router.patch('/mentor/profile-update', authenticateToken, isUserBlocked, isUserVerified, uploadMiddleware.single('profile'), controller.mentorProfileUpdate.bind(controller))
router.get('/mentor/check',authenticateToken, isUserBlocked, controller.mentorCheck.bind(controller))
router.patch('/verify', controller.mentorVerify.bind(controller))
router.get('/mentor/re-verify', authenticateToken, isUserBlocked, controller.mentorReVerify.bind(controller))

//////////////////////////////////// WEEK - 2 ///////////////////////

router.post('/mentor/course-upload', authenticateToken, isUserBlocked, isUserVerified, uploadMiddleware.fields([
    { name: 'demoVideo', maxCount: 5 },
    { name: 'thumbnail', maxCount: 1 }
]), controller.mentorAddCourse.bind(controller));
router.get('/get/all-course',authenticateToken, isUserBlocked, controller.mentorGetAllCourse.bind(controller))
router.get('/get/course',authenticateToken, isUserBlocked, controller.mentorGetCourse.bind(controller))
router.patch('/edit/course', authenticateToken, isUserBlocked, isUserVerified, uploadMiddleware.fields([
    { name: 'demoVideo', maxCount: 5 },
    { name: 'thumbnail', maxCount: 1 }
]), controller.mentorEditCourse.bind(controller))
router.patch('/unPublish/course',authenticateToken, isUserBlocked, isUserVerified, controller.mentorUnPulishCourse.bind(controller))
router.patch('/publish/course',authenticateToken, isUserBlocked, isUserVerified, controller.mentorPublishCourse.bind(controller))
router.get('/filter/course',authenticateToken, isUserBlocked, controller.mentorFilterCourse.bind(controller))
router.get(`/get/categories`,authenticateToken, isUserBlocked, controller.mentorGetAllCategorise.bind(controller))
router.post('/mentor/chapter-upload',authenticateToken, isUserBlocked, isUserVerified, uploadMiddleware.single('chapterVideo'), controller.mentorAddChapter.bind(controller))
router.patch('/edit/chapter',authenticateToken, isUserBlocked, isUserVerified, uploadMiddleware.single('chapterVideo'), controller.mentorEditChapter.bind(controller))
router.get(`/get/all-chapters`,authenticateToken, isUserBlocked, controller.mentorGetAllChapters.bind(controller))
router.post('/add/quizz',authenticateToken, isUserBlocked, isUserVerified, controller.mentorAddQuizz.bind(controller))
router.get(`/get/all-quizz`,authenticateToken, isUserBlocked, controller.mentorGetAllQuizz.bind(controller))
router.delete('/delete/quizz',authenticateToken, isUserBlocked, isUserVerified, controller.mentorDeleteQuizz.bind(controller))
router.get('/get/wallet',authenticateToken, isUserBlocked, isUserVerified, controller.mentorGetWallet.bind(controller))

//////////////////////////////////// WEEK - 3 /////////////////////////

router.get('/get/rooms', authenticateToken, isUserBlocked, isUserVerified, controller.mentorChatGetRooms.bind(controller))
router.post('/create/room', authenticateToken, isUserBlocked, isUserVerified, controller.mentorCreateRoom.bind(controller))
router.get('/get/message/:roomId', authenticateToken, isUserBlocked, isUserVerified, controller.mentorGetMessages.bind(controller))
router.post('/save/message', authenticateToken, isUserBlocked, isUserVerified, controller.mentorSaveMessage.bind(controller))





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







