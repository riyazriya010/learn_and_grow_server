import { Router } from "express";
import { MentorController } from "../controllers/mentors.controller";
import authenticateToken from "../middleware/verifyToken";

const router = Router()
const mentorController = new MentorController()

router.post('/mentor/login')
router.post('/mentor/signup', mentorController.mentorSignUp.bind(mentorController))
router.post('/mentor/google-login')
router.post('/mentor/sample',authenticateToken, mentorController.sample.bind(mentorController))

const mentorRoutes = router
export default mentorRoutes;
