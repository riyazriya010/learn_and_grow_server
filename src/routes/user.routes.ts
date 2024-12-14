import express from 'express';
import signupController from '../controllers/signupController';

const userRouter = express.Router();

// POST route to handle user signup
userRouter.post('/signup', signupController);

export default userRouter;
