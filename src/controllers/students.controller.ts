import { Request, Response } from "express";
import UserServices from "../services/userService";
import bcrypt from 'bcrypt'
import { verifyToken } from "../integration/mailToken";
import { JwtService } from "../integration/jwt";
import crypto from 'crypto'
import jwt from 'jsonwebtoken'
import getId from "../integration/getId";
import { promises } from "dns";


export default class UserController {
    private userServices: UserServices
    private jwtService: JwtService

    constructor() {
        this.userServices = new UserServices()
        this.jwtService = new JwtService()
    }

    //Student SignUp Method
    public async studentSignup(req: Request, res: Response): Promise<any> {
        try {
            let { username, email, phone, password } = req.body

            const saltRound = 10
            const hashPassword = await bcrypt.hash(password, saltRound)
            password = hashPassword

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

        } catch (error: unknown) {
            if (error instanceof Error) {
                if (error.name === 'UserAlreadyExit') {
                    return res
                        .status(409)
                        .send({
                            message: 'User Already Exist',
                            success: false
                        })
                }
            }
        }
    }


    // Student google SignUp Method
    public async studentGoogleSignIn(req: Request, res: Response): Promise<any> {
        try {
            const { email, displayName } = req.body

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

        } catch (error: unknown) {
            if (error instanceof Error) {
                if (error.name === 'UserAlreadyExit') {
                    return res
                        .status(409)
                        .send({
                            message: 'User Already Exist',
                            success: false
                        })
                }
            }
        }
    }


    // Student Google Login Method
    public async studentGoogleLogin(req: Request, res: Response): Promise<any> {
        try {
            const { email } = req.body

            const addStudent = await this.userServices.studentGoogleLogin(email)

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

        } catch (error: unknown) {
            if (error instanceof Error) {
                if (error.name === 'UserNotFound') {
                    return res
                        .status(403)
                        .send({
                            message: 'User Not Found'
                        })
                }

                if (error.name === 'UserBlocked') {
                    return res
                        .status(403)
                        .send({
                            message: 'User Blocked'
                        })
                }
            }
            throw error
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

            if (isBlocked) {
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
                    message: 'Token Expired',
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

            if (!response) {
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
                    message: 'Password Updated',
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
        try {
            const email = req.query.email
            const response = await this.userServices.studentReVerify(String(email))
            return res.status(200).send({
                message: 'Verification Mail sent Successfully',
                success: true,
                user: response
            })
        } catch (error) {
            console.log(error)
        }
    }

    public async profileUpdate(req: Request, res: Response): Promise<any> {
        try {
            console.log('file: ', req.file)

            const file = req.file as any;
            const { username, phone } = req.body

            const data = {
                username,
                phone,
                profilePicUrl: file?.location
            }
            const userId = await getId('accessToken', req)
            const response = await this.userServices.profileUpdate(String(userId), data)
            if (response) {
                return res.status(201).send({
                    message: 'User Updated',
                    success: true,
                    user: response
                })
            }
        } catch (error: any) {
            console.log(error)
        }
    }


    /*----------------------------------------- WEEK -2 ----------------------------*/


    public async getAllCourses(req: Request, res: Response): Promise<any> {
        try {

            const { page = 1, limit = 6 } = req.query;

            // Validate page and limit
            const pageNumber = parseInt(page as string, 10);
            const limitNumber = parseInt(limit as string, 10);

            if (pageNumber < 1 || limitNumber < 1) {
                return res.status(400).send({
                    message: 'Invalid page or limit value',
                    success: false
                });
            }

            // Call the service to get the courses with pagination
            const response = await this.userServices.getAllCourses(pageNumber, limitNumber);

            return res.status(200).send({
                message: 'Courses Fetched Successfully',
                success: true,
                result: response
            });
        } catch (error: unknown) {
            if (error instanceof Error) {
                if (error.name === 'CoursesNotFound') {
                    return res.status(404).send({
                        message: 'Courses Not Found',
                        success: false
                    });
                }
            }
            return res.status(500).send({
                message: 'Internal Server Error',
                success: false
            });
        }
    }



    public async getCourse(req: Request, res: Response): Promise<any> {
        try {
            const courseId = req.query.courseId

            if (!courseId) {
                return res
                    .status(400)
                    .send({
                        message: 'CourseId ID is required in the query parameters.',
                        success: false
                    })
            }

            const response = await this.userServices.getCourse(String(courseId))

            return res
                .status(200)
                .send({
                    message: 'Course Got It',
                    success: true,
                    data: response
                })

        } catch (error: any) {
            console.log(error)
            if (error.name === 'Course Not Found') {
                return res
                    .status(404)
                    .send({
                        message: 'Course Not Found',
                        success: false
                    })
            }
        }
    }



    public async getCoursePlay(req: Request, res: Response): Promise<any> {
        try {
            const courseId = req.query.courseId

            if (!courseId) {
                return res
                    .status(400)
                    .send({
                        message: 'Course ID is required in the query parameters.',
                        success: false
                    })
            }

            const response = await this.userServices.getCoursePlay(String(courseId))

            return res
                .status(200)
                .send({
                    message: 'Course Got It to paly',
                    success: true,
                    data: response
                })

        } catch (error: any) {
            console.log(error)
            if (error.name === 'CoursesNotFound') {
                return res
                    .status(404)
                    .send({
                        message: 'Course Not Found',
                        success: false
                    })
            }
        }
    }


    public async filterData(req: Request, res: Response): Promise<any> {
        try {

            const { page = 1, limit = 6 } = req.query;
            const { selectedCategory, selectedLevel, searchTerm } = req.query

            // Validate page and limit
            const pageNumber = parseInt(page as string, 10);
            const limitNumber = parseInt(limit as string, 10);

            if (pageNumber < 1 || limitNumber < 1) {
                return res
                    .status(400)
                    .send({
                        message: 'Invalid page or limit value',
                        success: false
                    });
            }

            const response = await this.userServices.filterData(
                pageNumber,
                limitNumber,
                String(selectedCategory),
                String(selectedLevel),
                String(searchTerm)
            )

            return res.status(200).send({
                message: 'Courses Filtered Successfully',
                success: true,
                data: response
            });

        } catch (error: any) {
            if (error && error.name === 'CourseNotFound') {
                return res
                    .status(404)
                    .send({
                        message: 'Course Not Found',
                        success: false
                    })
            }
            throw error
        }
    }


    public async buyCourse(req: Request, res: Response): Promise<any> {
        try {

            const courseId = req.query.courseId
            const txnid = req.query.txnid
            const amount = req.query.amount
            const courseName = req.query.courseName

            const isCourseExist = await this.userServices.findCourseById(String(courseId), Number(amount), String(courseName))

            if (isCourseExist) {
                const chapters = await this.userServices.findChaptersById(String(courseId))

                if (chapters.length !== 0) {

                    const completedChapters = chapters.map((chapter: any) => ({
                        chapterId: chapter._id,
                        isCompleted: false,
                    }));

                    const userId = await getId('accessToken', req)

                    const response = await this.userServices.buyCourse(String(userId), String(isCourseExist._id), completedChapters, String(txnid))
                    return res
                        .status(200)
                        .send({
                            message: 'Course Buyed Successfully',
                            success: true,
                            data: response
                        })
                }
            }

        } catch (error: any) {
            throw error
        }
    }



    public async isVerified(req: Request, res: Response): Promise<any> {
        try {

            const userId = await getId('accessToken', req)

            return res
                .status(200)
                .send({
                    message: 'Succes Verified',
                    success: true
                })
        } catch (error: any) {
            throw error
        }
    }



    public async getBuyedCourses(req: Request, res: Response): Promise<any> {
        try {
            // Parse query parameters
            const { page = 1, limit = 4 } = req.query;

            const pageNumber = parseInt(page as string, 10);
            const limitNumber = parseInt(limit as string, 10);

            if (pageNumber < 1 || limitNumber < 1) {
                const error = new Error('Invalid page or limit value')
                error.name = 'Invalid page or limit value'
                throw error
            }

            // Get user ID (hardcoded for now, replace with token-based logic later)
            const userId = await getId('accessToken', req)

            // Fetch buyed courses using the repository function
            const response = await this.userServices.getBuyedCourses(String(userId), pageNumber, limitNumber);

            // Format the response
            const formattedResponse = response.courses.map((course: any) => ({
                _id: course._id,
                courseDetails: {
                    courseName: course.courseId.courseName,
                    level: course.courseId.level,
                },
                completedChapters: course.completedChapters,
                isCourseCompleted: course.isCourseCompleted,
                purchasedAt: course.purchasedAt,
            }));

            // Update the courses in the response object
            response.courses = formattedResponse;

            // Send the response
            return res.status(200).send({
                message: "Buyed Courses Got Successfully",
                success: true,
                data: response,
            });
        } catch (error: unknown) {
            if (error instanceof Error) {
                if (error.name === 'Invalid page or limit value') {
                    return res.status(400).send({
                        message: "Invalid page or limit value",
                        success: false,
                    });
                }
            }
            throw error
        }
    }


    public async coursePlay(req: Request, res: Response): Promise<any> {
        try {

            const { buyedId } = req.query
            const getCourse = await this.userServices.coursePlay(String(buyedId))
            return res
                .status(200)
                .send({
                    message: 'Course Got it to play',
                    success: true,
                    data: getCourse
                })
        } catch (error: any) {
            throw error
        }
    }


    public async chapterVideoEnd(req: Request, res: Response): Promise<any> {
        try {
            const { chapterId } = req.query

            if (!chapterId) {
                const error = new Error("ChapterId is not provided in the query");
                error.name = "MissingChapterIdError";
                throw error;
            }

            const response = await this.userServices.chapterVideoEnd(String(chapterId))

            return res
                .status(200)
                .send({
                    message: 'Chapter Marked As Completed',
                    succes: true,
                    data: response
                })

        } catch (error: unknown) {
            if (error instanceof Error) {
                if (error.name === "MissingChapterIdError") {
                    return res.status(400).send({
                        message: error.message,
                        success: false,
                    });
                }
            }
            throw error
        }
    }



    public async getCertificate(req: Request, res: Response): Promise<any> {
        try {
            const { certificateId } = req.query

            if (!certificateId) {
                const error = new Error("certificateId is not provided in the query");
                error.name = "MissingCertificateIdError";
                throw error;
            }

            const response = await this.userServices.getCertificate(String(certificateId))

            return res
                .status(200)
                .send({
                    message: 'Certificate Got It',
                    success: true,
                    data: response
                })

        } catch (error: any) {
            if (error instanceof Error) {
                if (error.name === "MissingCertificateIdError") {
                    return res.status(400).send({
                        message: error.message,
                        success: false,
                    });
                }
            }
            throw error
        }
    }


    public async getQuizz(req: Request, res: Response): Promise<any> {
        try {
            const { courseId } = req.query

            if (!courseId) {
                const error = new Error("courseId is not provided in the query");
                error.name = "MissingCourseIdError";
                throw error;
            }

            const response = await this.userServices.getQuizz(String(courseId))

            return res
                .status(200)
                .send({
                    message: 'Quizz got it',
                    success: true,
                    data: response
                })
        } catch (error: any) {
            if (error instanceof Error) {
                if (error.name === "MissingCertificateIdError") {
                    return res.status(400).send({
                        message: error.message,
                        success: false,
                    });
                }
            }
            throw error
        }
    }

    public async completeCourse(req: Request, res: Response): Promise<any> {
        try {
            const userId = await getId('accessToken', req)
            const { courseId } = req.query
            const response = await this.userServices.completeCourse(String(userId), String(courseId))

            if (response === 'Course Already Completed') {
                return res
                    .status(200)
                    .send({
                        message: 'Course Already Completed',
                        success: true
                    })
            }

            return res
                .status(200)
                .send({
                    message: 'Course Completed Successfully',
                    success: true,
                    data: response
                })

        } catch (error: any) {
            throw error
        }
    }


    public async createCertificate(req: Request, res: Response): Promise<any> {
        try {
            const userId = await getId('accessToken', req) as String

            if (!userId) {
                return res.status(401).send({
                    message: 'Unauthorized: User ID not found',
                    success: false,
                });
            }

            const { username, courseName, mentorName, courseId } = req.body;

            // Validate required fields
            if (!username || !courseName || !mentorName || !courseId) {
                const error = new Error('All fields are required')
                error.name = 'AllFieldsRequired'
                throw error
            }

            const data = {
                userId,
                username,
                courseName,
                mentorName,
                courseId,
            };

            // Call service to create certificate
            const response = await this.userServices.createCertificate(data);

            return res.status(200).send({
                message: 'Certificate Created Successfully',
                success: true,
                data: response,
            });

        } catch (error: unknown) {
            if (error instanceof Error) {
                if (error.name === 'AllFieldsRequired') {
                    return res.status(400).send({
                        message: 'All fields are required',
                        success: false,
                    });
                }
            }
            throw error
        }
    }



    public async getCertificates(req: Request, res: Response): Promise<any> {
        try {
            const response = await this.userServices.getCertificates()
            return res
                .status(200)
                .send({
                    message: 'Certificates All Got It',
                    success: true,
                    data: response
                })
        } catch (error: any) {
            throw error
        }
    }

}
