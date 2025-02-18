import { Request, Response } from "express";
import StudentServices from "../../services/business/student.services";
import { JwtService } from "../../integration/jwt";
import { ErrorResponse, SuccessResponse } from "../../utils/responseUtil";
import getId from "../../integration/getId";

export default class StudentController {
    private studentServices: StudentServices
    private jwtService: JwtService

    constructor(studentServices: StudentServices) {
        this.studentServices = studentServices
        this.jwtService = new JwtService()
    }

    /////////////////////////////////// WEEK - 1 //////////////////////////////

    async studentLogin(req: Request, res: Response): Promise<any> {
        try {
            const { email, password } = req.body

            const response = await this.studentServices.studentLogin(email, password)

            const accessToken = await this.jwtService.createToken(response?._id, String(response?.role))
            const refreshToken = await this.jwtService.createRefreshToken(response?._id, String(response?.role))

            return res
                .status(200)
                .cookie('accessToken', accessToken, {
                    httpOnly: false
                }).cookie('refreshToken', refreshToken, {
                    httpOnly: true
                })
                .send({
                    success: true,
                    message: 'User Logged Successfully',
                    result: response
                })
            // SuccessResponse(res, 200, 'Student Found', response, String(accessToken), String(refreshToken))
            // return
        } catch (error: unknown) {
            if (error instanceof Error) {
                if (error.name === 'PasswordInvalid' || error.name === 'EmailNotFound') {
                    ErrorResponse(res, 401, "Invalid Credentials")
                    return
                }
                if (error.name === 'StudentBlocked') {
                    ErrorResponse(res, 403, "Student Blocked")
                    return
                }
            }
            ErrorResponse(res, 500, "Internal Server Error");
            return
        }
    }

    async studentSignUp(req: Request, res: Response): Promise<any> {
        try {
            const { username, email, phone, password } = req.body

            const addUser = await this.studentServices.studentSignUp({ username, email, phone, password })

            const accessToken = await this.jwtService.createToken(addUser?._id, String(addUser?.role))
            const refreshToken = await this.jwtService.createRefreshToken(addUser?._id, String(addUser?.role))

            return res
                .status(200)
                .cookie('accessToken', accessToken, {
                    httpOnly: false
                }).cookie('refreshToken', refreshToken, {
                    httpOnly: true
                })
                .send({
                    success: true,
                    message: 'User signup Successfully',
                    result: addUser
                })

            // SuccessResponse(res, 201, " Student Added Successfully", addUser, String(accessToken), String(refreshToken))
            // return

        } catch (error: unknown) {
            if (error instanceof Error) {
                if (error.name === 'UserExist') {
                    ErrorResponse(res, 409, 'User Already Exists')
                    return
                }
            }
            ErrorResponse(res, 500, "Internal Server Error");
            return
        }
    }

    async studentGoogleSignUp(req: Request, res: Response): Promise<any> {
        try {
            const { email, displayName } = req.body
            const addStudent = await this.studentServices.studentGoogleSignUp(email, displayName)

            const accessToken = await this.jwtService.createToken(addStudent?._id, String(addStudent?.role))
            const refreshToken = await this.jwtService.createRefreshToken(addStudent?._id, String(addStudent?.role))

            return res
                .status(200)
                .cookie('accessToken', accessToken, {
                    httpOnly: false
                }).cookie('refreshToken', refreshToken, {
                    httpOnly: true
                })
                .send({
                    success: true,
                    message: 'User Google Signup Successfully',
                    result: addStudent
                })
            // SuccessResponse(res, 201, 'Student Added Successfully', addStudent, String(accessToken), String(refreshToken))
            // return
        } catch (error: unknown) {
            if (error instanceof Error) {
                if (error.name === 'UserExist') {
                    ErrorResponse(res, 409, 'User Already Exists')
                    return
                }
            }
            ErrorResponse(res, 500, "Internal Server Error");
            return
        }
    }

    async studentGoogleLogin(req: Request, res: Response): Promise<any> {
        try {
            const { email } = req.body
            const findUser = await this.studentServices.studentGoogleLogin(email)

            const accessToken = await this.jwtService.createToken(findUser?._id, String(findUser?.role))
            const refreshToken = await this.jwtService.createRefreshToken(findUser?._id, String(findUser?.role))


            return res
                .status(200)
                .cookie('accessToken', accessToken, {
                    httpOnly: false
                }).cookie('refreshToken', refreshToken, {
                    httpOnly: true
                })
                .send({
                    success: true,
                    message: 'User Logged Successfully',
                    result: findUser
                })
            // SuccessResponse(res, 200, "Student Found", findUser, String(accessToken), String(refreshToken))
            // return
        } catch (error: unknown) {
            if (error instanceof Error) {
                if (error.name === 'UserNotFound') {
                    ErrorResponse(res, 404, "User Not Found Please SignUp")
                    return
                }
            }
            ErrorResponse(res, 500, "Internal Server Error");
            return
        }
    }

    async studentForgetPassword(req: Request, res: Response): Promise<void> {
        try {
            const { email, password } = req.body
            const updatePassword = await this.studentServices.studentForgetPassword(email, password)
            SuccessResponse(res, 200, "Password Updated Successfully")
            return
        } catch (error: unknown) {
            if (error instanceof Error) {
                if (error.name === 'UserNotFound') {
                    ErrorResponse(res, 404, "Email Not Found Please try another Email")
                    return
                }
            }
            ErrorResponse(res, 500, "Internal Server Error");
            return
        }
    }

    async studentVerify(req: Request, res: Response): Promise<void> {
        try {
            const token = req.query.token as string
            const verifySudent = await this.studentServices.studentVerify(token)
            SuccessResponse(res, 200, "Student Verified", verifySudent)
            return
        } catch (error: unknown) {
            if (error instanceof Error) {
                if (error.name === 'tokenExpired') {
                    ErrorResponse(res, 401, "Token Expired Please GoTo Profile")
                    return
                }
                if (error.name === 'UserNotFound') {
                    ErrorResponse(res, 404, "Email Not Found Please try another Email")
                    return
                }
                if (error.name === 'Invalidtokenpayload') {
                    ErrorResponse(res, 401, "Invalid Token Payload")
                    return
                }
            }
            ErrorResponse(res, 500, "Internal Server Error");
            return
        }
    }

    async studentProfleUpdate(req: Request, res: Response): Promise<void> {
        try {
            console.log('req.body ', req.body)
            const file = req.file as any
            const { username, phone, profilePicUrl } = req.body
            const data = {
                username,
                phone,
                // profilePicUrl: file?.location
                profilePicUrl
            }
            const studentId = await getId('accessToken', req)
            const updateUser = await this.studentServices.studentProfleUpdate(String(studentId), data)
            SuccessResponse(res, 200, "Student Profile Updated", updateUser)
            return
        } catch (error: unknown) {
            ErrorResponse(res, 500, "Internal Server Error")
            return
        }
    }

    async studentReVerify(req: Request, res: Response): Promise<void> {
        try {
            const email = req.query.email
            const verifiedUesr = await this.studentServices.studentReVerify(String(email))
            SuccessResponse(res, 200, "Student Verified", verifiedUesr)
            return
        } catch (error: unknown) {
            if (error instanceof Error) {
                if (error.name === 'UserNotFound') {
                    ErrorResponse(res, 404, "Email Not Found Please try another Email")
                    return
                }
            }
            ErrorResponse(res, 500, "Internal Server Error")
            return
        }
    }

    async studentCheck(req: Request, res: Response): Promise<void> {
        try {
            const studentId = req.query.userId
            const checkStudent = await this.studentServices.studentCheck(String(studentId))
            SuccessResponse(res, 200, "Uesr Got It", checkStudent)
            return
        } catch (error: unknown) {
            ErrorResponse(res, 500, "Internal Server Error")
            return
        }
    }


    /////////////////////////////////// WEEK - 2 //////////////////////////////

    async studentGetAllCourses(req: Request, res: Response): Promise<void> {
        try {
            const { page = 1, limit = 6 } = req.query;
            const getAllCourses = await this.studentServices.studentGetAllCourses(String(page), String(limit))
            SuccessResponse(res, 200, "All Course Got It", getAllCourses)
            return
        } catch (error: unknown) {
            if (error instanceof Error) {
                if (error.name === 'CoursesNotFound') {
                    ErrorResponse(res, 404, "Courses Not Found")
                    return
                }
            }
            ErrorResponse(res, 500, "Internal Server Error")
            return
        }
    }

    async studentGetCourse(req: Request, res: Response): Promise<void> {
        try {
            console.log('req.query: ', req.query)
            const courseId = req.query.courseId
            const studentId = req?.query?.userId
            const getCourse = await this.studentServices.studentGetCourse(String(courseId), String(studentId))
            console.log('getCourse: ', getCourse)
            SuccessResponse(res, 200, "Course Got It", getCourse)
            return
        } catch (error: unknown) {
            ErrorResponse(res, 500, "Internal Server Error")
            return
        }
    }

    async studentCourseFilterData(req: Request, res: Response): Promise<void> {
        try {
            const { page = 1, limit = 6 } = req.query;
            const { selectedCategory, selectedLevel, searchTerm } = req.query
            const filteredCourse = await this.studentServices.studentCourseFilterData(
                {
                    pageNumber: Number(page),
                    limitNumber: Number(limit),
                    selectedCategory: String(selectedCategory),
                    selectedLevel: String(selectedLevel),
                    searchTerm: String(searchTerm)
                }
            )

            SuccessResponse(res, 200, "Data Filtered", filteredCourse)
            return;
        } catch (error: unknown) {
            if (error instanceof Error) {
                if (error.name === 'CourseNotFound') {
                    ErrorResponse(res, 404, "Courses Not Found")
                    return
                }
            }
            ErrorResponse(res, 500, "Internal Server Error")
            return
        }
    }

    async studentGetCoursePlay(req: Request, res: Response): Promise<void> {
        try {
            const courseId = req.query
            const getCoursePlay = await this.studentServices.studentGetCoursePlay(String(courseId))
            SuccessResponse(res, 200, "Course Got It", getCoursePlay)
            return
        } catch (error: unknown) {
            if (error instanceof Error) {
                if (error.name === 'CourseNotFound') {
                    ErrorResponse(res, 404, "Course Not Found")
                }
            }
            ErrorResponse(res, 500, "Internal Server Error")
            return
        }
    }

    async studentBuyCourse(req: Request, res: Response): Promise<void> {
        try {
            const { courseId, txnid, amount, courseName } = req.body
            const userId = await getId('accessToken', req) as string
            const buyCourse = await this.studentServices.studentBuyCourse({ userId, courseId, txnid, amount })
            SuccessResponse(res, 200, "Course Buyed Successfully", buyCourse)
            return
        } catch (error: unknown) {
            console.log('payment error ', error)
            if (error instanceof Error) {
                ErrorResponse(res, 404, "Chapters Not Found")
                return
            }
            ErrorResponse(res, 500, "Internal Server Error")
            return
        }
    }

    async studentBuyedCourses(req: Request, res: Response): Promise<void> {
        try {
            console.log('buyedCourse controller ', req.query)
            const { page = 1, limit = 4 } = req.query;
            const studentId = await getId('accessToken', req) as string
            const buyedCourse = await this.studentServices.studentBuyedCourses(studentId, String(page), String(limit))
            SuccessResponse(res, 200, "Buyed Courses Got It", buyedCourse)
            return
        } catch (error: unknown) {
            console.info('error ', error)
            ErrorResponse(res, 500, "Internal Server Error")
            return
        }
    }

    async studentCoursePlay(req: Request, res: Response): Promise<void> {
        try {
            const purchaseId = req.query.buyedId
            const coursePlay = await this.studentServices.studentCoursePlay(String(purchaseId))
            SuccessResponse(res, 200, "Course Got It For Play", coursePlay)
            return
        } catch (error: unknown) {
            ErrorResponse(res, 500, "Internal Server Error")
            return
        }
    }

    async studentChapterVideoEnd(req: Request, res: Response): Promise<void> {
        try {
            const { chapterId, studiedTime } = req.query
            const findCoures = await this.studentServices.studentChapterVideoEnd(String(chapterId), String(studiedTime))
            SuccessResponse(res, 200, "Chapter Video Ended", findCoures)
            return
        } catch (error: unknown) {
            console.log('chap end ', error)
            ErrorResponse(res, 500, "Internal Server Error")
            return
        }
    }

    async studentGeCerfiticate(req: Request, res: Response): Promise<void> {
        try {
            const { certificateId } = req.query
            const getCertificate = await this.studentServices.studentGeCerfiticate(String(certificateId))
            SuccessResponse(res, 200, "Certificate Got It", getCertificate)
            return
        } catch (error: any) {
            ErrorResponse(res, 500, "Internal Server Error")
            return
        }
    }

    async studentCompleteCourse(req: Request, res: Response): Promise<void> {
        try {
            const studentId = await getId('accessToken', req)
            const { courseId } = req.query
            const completeCourse = await this.studentServices.studentCompleteCourse(String(studentId), String(courseId))
            SuccessResponse(res, 200, "Corse Completed", completeCourse)
            return
        } catch (error: unknown) {
            if (error instanceof Error) {
                if (error.name === "CourseAlreadyCompleted") {
                    ErrorResponse(res, 401, "Course Already Completed")
                    return
                }
            }
            ErrorResponse(res, 500, "Internal Server Error")
            return
        }
    }

    async studentQuizz(req: Request, res: Response): Promise<void> {
        try {
            const { courseId } = req.query
            const getQuizz = await this.studentServices.studentQuizz(String(courseId))
            SuccessResponse(res, 200, "Quizz Got It", getQuizz)
            return
        } catch (error: unknown) {
            ErrorResponse(res, 500, "Internal Server Error")
            return
        }
    }

    async studentCreateCertificate(req: Request, res: Response): Promise<void> {
        try {
            const userId = await getId('accessToken', req) as string
            const { username, courseName, mentorName, courseId } = req.body;
            const data = {
                studentId: userId,
                studentName: username,
                courseName,
                mentorName,
                courseId,
            };

            const createCertificate = await this.studentServices.studentCreateCertificate(data)
            SuccessResponse(res, 200, "Certificate Created", createCertificate)
            return
        } catch (error: unknown) {
            console.info('create certificate Error ::: ', error)
            ErrorResponse(res, 500, "Internal Server Error")
            return
        }
    }

    async studentGetAllCertificates(req: Request, res: Response): Promise<void> {
        try {
            const userId = await getId('accessToken', req)
            const getCertificates = await this.studentServices.studentGetAllCertificates(String(userId))
            SuccessResponse(res, 200, "Certificates All Got It", getCertificates)
            return
        } catch (error: unknown) {
            ErrorResponse(res, 500, "Internal Server Error")
            return
        }
    }

    async studentIsVerified(req: Request, res: Response): Promise<void> {
        try {
            const userId = await getId('accessToken', req)
            SuccessResponse(res, 200, "Student Verified")
            return
        } catch (error: unknown) {
            ErrorResponse(res, 500, "Internal Server Error")
            return
        }
    }



    ///////////////////////////////// WEEK - 3 ////////////////////////////

    async studentChatGetMentors(req: Request, res: Response): Promise<void> {
        try {
            const studentId = getId("accessToken", req) as string
            const getMentors = await this.studentServices.studentChatGetMentors(studentId)
            SuccessResponse(res, 200, "Mentors Got It", getMentors)
            return
        } catch (error: unknown) {
            ErrorResponse(res, 500, "Internal Server Error")
            return
        }
    }

    async studentCreateRoom(req: Request, res: Response): Promise<void> {
        try {
            const { mentorId } = req.body
            const studentId = getId("accessToken", req) as string
            const createdRoom = await this.studentServices.studentCreateRoom(studentId, String(mentorId))
            SuccessResponse(res, 200, "Room Created", createdRoom)
            return
        } catch (error: unknown) {
            ErrorResponse(res, 500, "Internal Server Error")
            return
        }
    }

    async studentSaveMessage(req: Request, res: Response): Promise<void> {
        try {
            const { message, mentorId } = req.body
            const studentId = getId("accessToken", req) as string
            const savedMessage = await this.studentServices.studentSaveMessage(studentId, String(mentorId), String(message))
            SuccessResponse(res, 200, "Message Saved", savedMessage)
            return
        } catch (error: unknown) {
            ErrorResponse(res, 500, "Internal Server Error")
            return
        }
    }

    async studentGetMessages(req: Request, res: Response): Promise<void> {
        try {
            const { mentorId } = req.params
            const studentId = getId("accessToken", req) as string
            const getMessage = await this.studentServices.studentGetMessages(studentId, String(mentorId))
            SuccessResponse(res, 200, "Message Got It", getMessage)
            return
        } catch (error: unknown) {
            ErrorResponse(res, 500, "Internal Server Error")
            return
        }
    }

    async studentDeleteEveryOne(req: Request, res: Response): Promise<void> {
        try {
            const { messageId } = req.params
            const deleteEveryOne = await this.studentServices.studentDeleteEveryOne(String(messageId))
            SuccessResponse(res, 200, "Message deleted foreveryone", deleteEveryOne)
            return
        } catch (error: unknown) {
            ErrorResponse(res, 500, "Internal Server Error")
            return
        }
    }

    async studentDeleteForMe(req: Request, res: Response): Promise<void> {
        try {
            const { messageId } = req.params
            const deleteForMe = await this.studentServices.studentDeleteForMe(String(messageId))
            SuccessResponse(res, 200, "Message deleted me", deleteForMe)
            return
        } catch (error: unknown) {
            ErrorResponse(res, 500, "Internal Server Error")
            return
        }
    }

    async studentResetCount(req: Request, res: Response): Promise<void> {
        try {
            const { mentorId } = req.params
            const studentId = await getId('accessToken', req) as string
            const resetCount = await this.studentServices.studentResetCount(studentId, String(mentorId))
            SuccessResponse(res, 200, "Count Reset", resetCount)
            return
        } catch (error: unknown) {
            ErrorResponse(res, 500, "Internal Server Error")
            return
        }
    }


    // Notification
    async studentCreateNotification(req: Request, res: Response): Promise<void> {
        try {
            console.log('noti ', req.body)
            const { username, senderId, receiverId } = req.body
            const createNotify = await this.studentServices.studentCreateNotification(String(username), String(senderId), String(receiverId))
            SuccessResponse(res, 200, "notification created", createNotify)
            return
        } catch (error: unknown) {
            ErrorResponse(res, 500, "Internal Server Error")
            return
        }
    }

    async studentGetNotifications(req: Request, res: Response): Promise<void> {
        try {
            const { studentId } = req.params
            const getNotification = await this.studentServices.studentGetNotifications(String(studentId))
            SuccessResponse(res, 200, "notification got it", getNotification)
            return
        } catch (error: unknown) {
            ErrorResponse(res, 500, "Internal Server Error")
            return
        }
    }

    async studentGetNotificationsCount(req: Request, res: Response): Promise<void> {
        try {
            const { studentId } = req.params
            const getCount = await this.studentServices.studentGetNotificationsCount(String(studentId))
            SuccessResponse(res, 200, "count got it", getCount)
            return
        } catch (error: unknown) {
            ErrorResponse(res, 500, "Internal Server Error")
            return
        }
    }

    async studentGetNotificationsSeen(req: Request, res: Response): Promise<void> {
        try {
            const markSeen = await this.studentServices.studentGetNotificationsSeen()
            SuccessResponse(res, 200, "marked seen", markSeen)
            return
        } catch (error: unknown) {
            ErrorResponse(res, 500, "Internal Server Error")
            return
        }
    }

    async studentDeleteNotifications(req: Request, res: Response): Promise<void> {
        try {
            const { senderId } = req.params
            const deleteNotify = await this.studentServices.studentDeleteNotifications(String(senderId))
            SuccessResponse(res, 200, "notification deleted", deleteNotify)
            return
        } catch (error: unknown) {
            ErrorResponse(res, 500, "Internal Server Error")
            return
        }
    }

    async studentGetMentor(req: Request, res: Response): Promise<void> {
        try {
            const { mentorId } = req.params;
            const studentId = await getId("accessToken", req) as string
            const getMentor = await this.studentServices.studentGetMentor(studentId, String(mentorId))
            SuccessResponse(res, 200, "mentor got it", getMentor)
            return
        } catch (error: unknown) {
            ErrorResponse(res, 500, "Internal Server Error")
            return
        }
    }

    async studentGetBadges(req: Request, res: Response): Promise<void> {
        try {
            const studentId = await getId('accessToken', req) as string
            const getBadges = await this.studentServices.studentGetBadges(studentId)
            SuccessResponse(res, 200, "Badges Got It", getBadges)
            return;
        } catch (error: unknown) {
            ErrorResponse(res, 500, "Internal Server Error")
            return
        }
    }

}


