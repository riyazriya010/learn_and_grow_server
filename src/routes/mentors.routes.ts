import { Router } from "express";
import { MentorController } from "../controllers/mentors.controller";
import isUserBlocked from "../middleware/blocked";
import authenticateToken from "../middleware/verifyToken";
import isUserVerified from "../middleware/verified";
import uploadMiddleware from "../middleware/multer";

const router = Router()
const mentorController = new MentorController()

/* ------------------------------- WEEK 1 ---------------------------*/

router.post('/mentor/login', mentorController.mentorLogin.bind(mentorController))
router.post('/mentor/signup', mentorController.mentorSignUp.bind(mentorController))
router.post('/mentor/google-login', mentorController.mentorGoogleLogin.bind(mentorController))
router.post('/mentor/google-signUp', mentorController.mentorGoogleSignUp.bind(mentorController))
router.patch('/mentor/forget-password', mentorController.forgetPassword.bind(mentorController))
router.patch('/mentor/profile-update', authenticateToken, isUserVerified, isUserBlocked, uploadMiddleware.single('profile'), mentorController.profileUpdate.bind(mentorController))
router.get('/mentor/check', mentorController.checkMentor.bind(mentorController))
router.patch('/verify', mentorController.verifyMentor.bind(mentorController))
router.get('/mentor/re-verify', authenticateToken, isUserBlocked, mentorController.mentorReVerify.bind(mentorController))


/* ------------------------------- WEEK 2 ---------------------------*/

router.post('/mentor/course-upload', uploadMiddleware.fields([
    { name: 'demoVideo', maxCount: 5 },
    { name: 'thumbnail', maxCount: 1 }
]), mentorController.addCourse.bind(mentorController));

router.get('/get/all-course', mentorController.getAllCourses.bind(mentorController))
router.get('/get/course', mentorController.getCourse.bind(mentorController))

router.patch('/edit/course', uploadMiddleware.fields([
    { name: 'demoVideo', maxCount: 5 },
    { name: 'thumbnail', maxCount: 1 }
]), mentorController.editCourse.bind(mentorController))

router.patch('/unPublish/course', mentorController.unPublishCourse.bind(mentorController))
router.patch('/publish/course', mentorController.publishCourse.bind(mentorController))

router.get('/filter/course', mentorController.filterCourse.bind(mentorController))

router.get(`/get/categories`, mentorController.getAllCategory.bind(mentorController))

router.post('/mentor/chapter-upload', uploadMiddleware.single('chapterVideo'), mentorController.addChapter.bind(mentorController))
router.patch('/edit/chapter', uploadMiddleware.single('chapterVideo'), mentorController.editChapter.bind(mentorController))
router.get(`/get/all-chapters`, mentorController.getAllChapters.bind(mentorController))

router.post('/add/quizz', mentorController.addQuizz.bind(mentorController))
router.get(`/get/all-quizz`, mentorController.getAllQuizz.bind(mentorController))
router.delete('/delete/quizz', mentorController.deleteQuizz.bind(mentorController))

router.get('/get/wallet', mentorController.getWallet.bind(mentorController))


const mentorRoutes = router
export default mentorRoutes;








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







