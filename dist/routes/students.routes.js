"use strict";
// import { Request, Response, Router } from "express";
// import UserController from "../controllers/students.controller";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// export default class UserRoutes {
//     private router: Router
//     private userContorller: UserController
//     constructor(){
//         this.router = Router()
//         this.userContorller = new UserController()
//         this.initializeRoutes() // Set up routes
//     }
//     private initializeRoutes(){
//         this.router.get('/getUser', async (req: Request, res: Response) => { 
//             await this.userContorller.getAllusers(req, res) 
//         })
//         this.router.post('/signup', async (req: Request, res: Response) => {
//             await this.userContorller.createUser(req, res)
//         })
//         this.router.post('/login', async (req: Request, res: Response) => {
//             await this.userContorller.findUser(req, res)
//         })
//         this.router.patch('/verify', async (req: Request, res: Response) => {
//             await this.userContorller.verifyUser(req, res)
//         })
//         this.router.post('/google-login', async (req: Request, res: Response) => {
//             await this.userContorller.googleLogin(req, res)
//         })
//     }
//     public getRouter() {
//         return this.router;
//     }
// }
const express_1 = require("express");
const students_controller_1 = __importDefault(require("../controllers/students.controller"));
const userController = new students_controller_1.default();
const router = (0, express_1.Router)();
// router.get('/getUser ', userController.getAllusers.bind(userController));
// router.post('/login', userController.findUser .bind(userController));
// router.patch('/verify', userController.verifyUser .bind(userController));
// router.post('/google-login', userController.googleLogin.bind(userController));
router.post('/student/signup', userController.studentSignup.bind(userController));
router.post('/student/google-login', userController.studentGoogleSignIn.bind(userController));
router.post('/student/login', userController.studentLogin.bind(userController));
const userRoutes = router;
exports.default = userRoutes;
