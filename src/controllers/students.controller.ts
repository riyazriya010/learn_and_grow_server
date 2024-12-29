import { Request, Response } from "express";
import UserServices from "../services/userService";
import bcrypt from 'bcrypt'
import { verifyToken } from "../integration/mailToken";
import { JwtService } from "../integration/jwt";
import getId from "../integration/getId";


export default class UserController {
    private userServices: UserServices
    private jwtService: JwtService

    constructor() {
        this.userServices = new UserServices()
        this.jwtService = new JwtService()
    }


    // new methods

    //Student SignUp Method
    public async studentSignup(req: Request, res: Response): Promise<any> {
        try {
            let { username, email, phone, password } = req.body

            const saltRound = 10
            const hashPassword = await bcrypt.hash(password, saltRound)
            password = hashPassword

            const ExistUser = await this.userServices.findByEmail(email)
            if (ExistUser) {
                return res.status(409).send({ message: 'User Already Exist', success: false, })
            }

            const addStudent = await this.userServices.studentSignup({ username, email, phone, password })

            if (addStudent && addStudent.role) {
                const userJwtToken = await this.jwtService.createToken(addStudent._id, addStudent.role)
                const userRefreshToken = await this.jwtService.createRefreshToken(addStudent._id, addStudent.role)

                return res
                    .status(201)
                    .cookie('accessToken', userJwtToken, {
                        httpOnly: false
                    }).cookie('refreshToken', userRefreshToken, {
                        httpOnly: true
                    })
                    .send({
                        success: true,
                        message: 'Student Added Successfully',
                        user: addStudent
                    })
            }

        } catch (error) {
            console.error(error)
        }
    }

    
    // Student google SignUp Method
    public async studentGoogleSignIn(req: Request, res: Response): Promise<any> {
        try {
            const { email, displayName } = req.body

            const ExistUser = await this.userServices.findByEmail(email)

            if (ExistUser) {
                return res.status(409).send({ message: 'User Already Exist', success: false })
            }

            const addStudent = await this.userServices.studentGoogleSignIn(email, displayName)

            if (addStudent && addStudent.role) {
                const userJwtToken = await this.jwtService.createToken(addStudent._id, addStudent.role)
                const userRefreshToken = await this.jwtService.createRefreshToken(addStudent._id, addStudent.role)

                return res
                    .status(201)
                    .cookie('accessToken', userJwtToken, {
                        httpOnly: false
                    }).cookie('refreshToken', userRefreshToken, {
                        httpOnly: true
                    })
                    .send({
                        success: true,
                        message: 'Google Account Added Successfully',
                        user: addStudent
                    })
            }

        } catch (error: any) {
            console.error(error.message)
        }
    }


    // Student Google Login Method
    public async studentGoogleLogin(req: Request, res: Response): Promise<any> {
        try {
            const { email } = req.body

            const addStudent = await this.userServices.studentGoogleLogin(email)

            if(!addStudent){
                return res.status(403).send({
                    message: 'Google User Not Found Please Go to Signup Page',
                    success: false
                })
            }

            if (addStudent?.isBlocked === true) {
                return res.status(403).send({
                    message: 'You Are Blocked',
                    success: false
                })
            }

            if (addStudent && addStudent.role) {
                const userJwtToken = await this.jwtService.createToken(addStudent._id, addStudent.role)
                const userRefreshToken = await this.jwtService.createRefreshToken(addStudent._id, addStudent.role)

                return res
                    .status(201)
                    .cookie('accessToken', userJwtToken, {
                        httpOnly: false
                    }).cookie('refreshToken', userRefreshToken, {
                        httpOnly: true
                    })
                    .send({
                        success: true,
                        message: 'Google Account Added Successfully',
                        user: addStudent
                    })
            }

        } catch (error: any) {
            console.error(error.message)
        }
    }

    // Student Login
    public async studentLogin(req: Request, res: Response): Promise<any> {
        try {
            const { email, password } = req.body

            const loggedUser = await this.userServices.studentLogin(email, password)


            if (loggedUser === null) {
                return res.status(401).send({ message: 'Invalid Credentials', success: false })
            }

            const isBlocked = loggedUser?.isBlocked

            if(isBlocked){
                return res.status(403).send({
                    message: 'Student  Account Blocked',
                    success: false
                })
            }

            const userJwtToken = await this.jwtService.createToken(loggedUser._id, String(loggedUser.role))
            const userRefreshToken = await this.jwtService.createRefreshToken(loggedUser._id, String(loggedUser.role))

            return res
                .status(200)
                .cookie('accessToken', userJwtToken, {
                    httpOnly: false
                }).cookie('refreshToken', userRefreshToken, {
                    httpOnly: true
                })
                .send({
                    success: true,
                    message: 'User Logged Successfully',
                    user: loggedUser
                })

        } catch (error) {
            console.error(error)
        }
    }

    public async verifyStudent(req: Request, res: Response): Promise<any> {
        try {
            const token = req.query.token as string

            // Verify the token
            const verifiedToken = await verifyToken(token);
            
            console.log('Verified token:', verifiedToken);

            if (!verifiedToken.status) {
                console.log('token expired')
                // throw new Error(verifiedToken.message || 'Token verification failed');
                return res.status(401).send({
                    message:'Token Expired',
                    status: false
                })
            }

            const payload = verifiedToken.payload;

            // Ensure payload is valid
            if (!payload || typeof payload !== 'object' || !('id' in payload) || !('email' in payload)) {
                throw new Error('Invalid token payload');
            }

            const { email } = payload;

            // Verify user using the email
            const response = await this.userServices.verifyUser(email);
            if (!response) {
                throw new Error('User not found or verification failed');
            }

            return res.status(201).send({ success: true, message: 'User verified successfully' });

        } catch (error: any) {
            console.log("Verify Token Error:", error);

            if (error.message === "Verification Token Expired") {
                return res.status(401).send({
                    message: "Token Expired Please Goto Profile To Verify",
                    status: false,
                });
            }
    
            return res.status(500).send({
                message: "Internal server error",
                status: false,
            });
        }
    }

    public async forgetPassword(req: Request, res: Response): Promise<any> {
        try {
            const data = req.body
            const response = await this.userServices.forgetPassword(data)

            if(!response){
                return res
                .status(401)
                .send({
                    message: 'Invalid Email',
                    success: true
                })
            }

            return res
            .status(200)
            .send({
                message:'Password Updated',
                success: true,
                user: response
            })

        } catch (error) {
            console.log(error)
        }
    }


    public async checkStudent(req: Request, res: Response): Promise<any> {
        try {
            const id = req.query.userId
            const response = await this.userServices.checkStudent(String(id))
            // if(response){
            //     const isBlocked = await this.userServices.isUserBlocked(String(response.email))
            //     if(isBlocked){
            //         return res.status(403).send({
            //             message: 'User is Blocked',
            //             success: true
            //         })
            //     }
            // }
            return res.status(200).send({
                message: 'User Got It',
                success: true,
                user: response
            })
        } catch (error) {
            console.log(error)
        }
    }

    
    public async studentReVerify(req: Request, res: Response): Promise<any> {
        try{
            const email = req.query.email
            const response = await this.userServices.studentReVerify(String(email))
            return res.status(200).send({
                message: 'Verification Mail sent Successfully',
                success: true,
                user: response
            })
        }catch(error){
            console.log(error)
        }
    }

    public async profileUpdate(req: Request, res: Response): Promise<any> {
        try{
            const { username, phone } = req.body
            const data = {
                username,
                phone
            }
            const userId = await getId('accessToken', req)
            const response = await this.userServices.profileUpdate(String(userId), data)
            if(response){
            return res.status(201).send({
                message: 'User Updated',
                success: true,
                user: response
            })
        }
        }catch(error: any){
            console.log(error)
        }
    }


    /*----------------------------------------- WEEK -2 ----------------------------*/

    public async getAllCourses(req: Request, res: Response): Promise<any> {
        try{
            const response = await this.userServices.getAllCourses()
            return res
            .status(200)
            .send({
                message: 'Courses Fetched Successfully',
                success: true,
                result: response
            })
        }catch(error: any){
            console.log(error)
        }
    }



    public async getCourse(req: Request, res: Response): Promise<any> {
        try{
            const courseId = req.query.courseId
            const response = await this.userServices.getCourse(String(courseId))
            return res
            .status(200)
            .send({
                message: 'Course Got It',
                success: true,
                data: response
            })
        }catch(error: any) {
            console.log(error)
        }
    }

}


