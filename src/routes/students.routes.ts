import { Router } from "express";
import UserController from "../controllers/students.controller";
import authenticateToken from "../middleware/verifyToken";
import isUserBlocked from "../middleware/blocked";
import isUserVerified from "../middleware/verified";

const userController = new UserController();
const router = Router();

router.post('/student/login', userController.studentLogin.bind(userController));
router.post('/student/signup', userController.studentSignup.bind(userController));

router.post('/student/google-signUp', userController.studentGoogleSignIn.bind(userController));
router.post('/student/google-login', userController.studentGoogleLogin.bind(userController));

router.patch('/student/forget-password', userController.forgetPassword.bind(userController));

router.patch('/student/profile-update', authenticateToken, isUserVerified, isUserBlocked, userController.profileUpdate.bind(userController))

router.patch('/verify', userController.verifyStudent.bind(userController));
router.get('/student/re-verify',authenticateToken, isUserBlocked, userController.studentReVerify.bind(userController));

router.get('/student/check', userController.checkStudent.bind(userController));


/* ------------------------------------ WEEK -2 ---------------------------------*/

router.get('/get/all-course', userController.getAllCourses.bind(userController))
router.get('/get/course', userController.getCourse.bind(userController))

const userRoutes = router
export default userRoutes;





