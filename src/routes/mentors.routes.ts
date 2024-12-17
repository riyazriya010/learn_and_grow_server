import { Router } from "express";
import { MentorController } from "../controllers/mentors.controller";

const router = Router()
const mentorController = new MentorController()

router.post('/mentor/login')
router.post('/mentor/signup', mentorController.mentorSignUp.bind(mentorController))
router.post('/mentor/google-login')

const mentorRoutes = router
export default mentorRoutes;
