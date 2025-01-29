import { Request, Response } from "express";
import MentorServices from "../../services/business/mentor.services";
import { ErrorResponse, SuccessResponse } from "../../utils/responseUtil";
import { JwtService } from "../../integration/jwt";
import getId from "../../integration/getId";
import { verifyToken } from "../../integration/mailToken";

export default class MentorController {
    private mentorServices: MentorServices
    private jwtService: JwtService

    constructor(mentorServices: MentorServices) {
        this.mentorServices = mentorServices
        this.jwtService = new JwtService()
    }

    //////////////////////////////////// WEEK - 1 //////////////////////////////////
    async MentorLogin(req: Request, res: Response): Promise<any> {
        try {
            const { email, password } = req.body
            const logUser = await this.mentorServices.mentorLogin(email, password)

            const accessToken = await this.jwtService.createToken(logUser?._id, String(logUser?.role))
            const refreshToken = await this.jwtService.createRefreshToken(logUser?._id, String(logUser?.role))

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
                    result: logUser
                })

            // SuccessResponse(res, 200, "Mentor Logged", logUser, String(accessToken), String(refreshToken))
            // return
        } catch (error: unknown) {
            if (error instanceof Error) {
                if (error.name === 'PasswordInvalid' || error.name === 'EmailNotFound') {
                    ErrorResponse(res, 401, "Invalid Credentials")
                    return
                }
                if (error.name === 'MentorBlocked') {
                    ErrorResponse(res, 403, "Mentor Blocked")
                    return
                }
            }
            ErrorResponse(res, 500, 'Internal Server Error')
            return
        }
    }

    async mentorSignUp(req: Request, res: Response): Promise<any> {
        try {
            const {
                username,
                email,
                phone,
                password,
                expertise,
                skills
            } = req.body
            const addedMentor = await this.mentorServices.mentorSignUp({
                username,
                email,
                phone,
                password,
                expertise,
                skills
            })

            const accessToken = await this.jwtService.createToken(addedMentor?._id, String(addedMentor?.role))
            const refreshToken = await this.jwtService.createRefreshToken(addedMentor?._id, String(addedMentor?.role))

            return res
            .status(200)
            .cookie('accessToken', accessToken, {
                httpOnly: false
            }).cookie('refreshToken', refreshToken, {
                httpOnly: true
            })
            .send({
                success: true,
                message: 'User Signup Successfully',
                result: addedMentor
            })

            // SuccessResponse(res, 200, "Mentor Added Successfully", addedMentor, String(accessToken), String(refreshToken))
            // return
        } catch (error: unknown) {
            if (error instanceof Error) {
                if (error.name === 'MentorExist') {
                    ErrorResponse(res, 409, 'Mentor Already Exists')
                    return
                }
            }
            ErrorResponse(res, 500, 'Internal Server Error')
            return
        }
    }

    async mentorGoogleSignUp(req: Request, res: Response): Promise<any> {
        try {
            const { email, displayName } = req.body
            const addedMentor = await this.mentorServices.mentorGoogleSignUp(email, displayName)

            const accessToken = await this.jwtService.createToken(addedMentor?._id, String(addedMentor?.role))
            const refreshToken = await this.jwtService.createRefreshToken(addedMentor?._id, String(addedMentor?.role))

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
                result: addedMentor
            })

            // SuccessResponse(res, 200, "Mentor Added SucessFully", addedMentor, String(accessToken), String(refreshToken))
            // return;
        } catch (error: unknown) {
            if (error instanceof Error) {
                if (error.name === 'MentorExist') {
                    ErrorResponse(res, 409, 'Mentor Already Exists')
                    return
                }
            }
            ErrorResponse(res, 500, 'Internal Server Error')
            return
        }
    }

    async mentorGoogleLogin(req: Request, res: Response): Promise<any> {
        try {
            const { email } = req.body
            const logMentor = await this.mentorServices.mentorGoogleLogin(email)

            const accessToken = await this.jwtService.createToken(logMentor?._id, String(logMentor?.role))
            const refreshToken = await this.jwtService.createRefreshToken(logMentor?._id, String(logMentor?.role))

            return res
            .status(200)
            .cookie('accessToken', accessToken, {
                httpOnly: false
            }).cookie('refreshToken', refreshToken, {
                httpOnly: true
            })
            .send({
                success: true,
                message: 'User Signup Successfully',
                result: logMentor
            })

            // SuccessResponse(res, 200, "Mentor Logged", logMentor, String(accessToken), String(refreshToken))
            // return;
        } catch (error: unknown) {
            if (error instanceof Error) {
                if (error.name === 'EmailNotFound') {
                    ErrorResponse(res, 401, "Invalid Credentials Please Signup")
                    return
                }
                if (error.name === 'MentorBlocked') {
                    ErrorResponse(res, 403, "Mentor Blocked")
                    return
                }
            }
            ErrorResponse(res, 500, 'Internal Server Error')
            return
        }
    }

    async mentorForgetPassword(req: Request, res: Response): Promise<void> {
        try {
            const { email, password } = req.body
            const updateMentor = await this.mentorServices.mentorForgetPassword(email, password)
            SuccessResponse(res, 200, "Mentor Password updated", updateMentor)
            return;
        } catch (error: unknown) {
            if (error instanceof Error) {
                if (error.name === "MentorNotFound") {
                    ErrorResponse(res, 404, "Mentor Not Found")
                    return
                }
            }
            ErrorResponse(res, 500, 'Internal Server Error')
            return
        }
    }

    async mentorProfileUpdate(req: Request, res: Response): Promise<void> {
        try {
            const file = req.file as any;
            const { username, phone } = req.body
            const data = {
                username,
                phone,
                profilePicUrl: file?.location
            }

            const mentorId = await getId('accessToken', req)
            const updatedProfile = await this.mentorServices.mentorProfileUpdate(String(mentorId), data)
            SuccessResponse(res, 200, "Mentor Profile Updated", updatedProfile)
            return
        } catch (error: unknown) {
            ErrorResponse(res, 500, 'Internal Server Error')
            return
        }
    }

    async mentorCheck(req: Request, res: Response): Promise<void> {
        try {
            const { userId } = req.query
            const checkMentor = await this.mentorServices.mentorCheck(String(userId))
            SuccessResponse(res, 200, "Mentor Got It", checkMentor)
            return;
        } catch (error: unknown) {
            ErrorResponse(res, 500, 'Internal Server Error')
            return
        }
    }


    async mentorVerify(req: Request, res: Response): Promise<void> {
        try {
            const token = req.query.token as string

            // Verify the token
            const verifiedToken = await verifyToken(token);

            console.log('Verified token:', verifiedToken);

            if (!verifiedToken.status) {
                const error = new Error('Token Expired')
                error.name = 'TokenExpired'
                throw error
            }

            const payload = verifiedToken.payload;

            // Ensure payload is valid
            if (!payload || typeof payload !== 'object' || !('id' in payload) || !('email' in payload)) {
                const error = new Error('Invalid token payload')
                error.name = 'InvalidTokenPayload'
                throw error
            }

            const { email } = payload;

            const verifyUser = await this.mentorServices.mentorVerify(String(email))

            SuccessResponse(res, 200, "User Verified", verifyUser)
            return
        } catch (error: unknown) {
            if (error instanceof Error) {
                if (error.name === 'TokenExpired') {
                    ErrorResponse(res, 401, "Token Expired")
                    return
                }
                if (error.name === 'InvalidTokenPayload') {
                    ErrorResponse(res, 401, 'Invalid token payload')
                    return
                }
            }
            ErrorResponse(res, 500, 'Internal Server Error')
            return
        }
    }

    async mentorReVerify(req: Request, res: Response): Promise<void> {
        try {
            const email = req.query.email
            const verifiyed = await this.mentorServices.mentorReVerify(String(email))
            SuccessResponse(res, 200, "User Verified", verifiyed)
            return;
        } catch (error: unknown) {
            ErrorResponse(res, 500, 'Internal Server Error')
            return
        }
    }



    //////////////////////////////////// WEEK - 2 ///////////////////////////////////

    async mentorAddCourse(req: Request, res: Response): Promise<void> {
        try {
            // Extract files
            const files = req.files as any;
            const mediaFiles = files?.demoVideo || [];
            const thumbnailFile = files?.thumbnail ? files.thumbnail[0] : null;

            // Map demo videos
            const demoVideo = mediaFiles.map((file: any) => ({
                type: 'video',
                url: file.location,
            }));

            // Extract thumbnail URL
            const thumbnailUrl = thumbnailFile ? thumbnailFile.location : null;

            const mentorId = await getId('accessToken', req)

            // Append processed fields to request body
            req.body.demoVideo = demoVideo;
            req.body.thumbnailUrl = thumbnailUrl;
            req.body.mentorId = String(mentorId)


            const data = req.body

            const addCourse = await this.mentorServices.mentorAddCourse(data)

            SuccessResponse(res, 200, "Course Added Successfully", addCourse)
            return
        } catch (error: unknown) {
            if (error instanceof Error) {
                if (error.name === 'AlreadyExist') {
                    ErrorResponse(res, 403, "Course Already Exist")
                    return;
                }
            }
            ErrorResponse(res, 500, 'Internal Server Error')
            return
        }
    }

    async mentorGetAllCourse(req: Request, res: Response): Promise<void> {
        try {
            const { page = 1, limit = 4 } = req.query;

            const pageNumber = parseInt(page as string, 10);
            const limitNumber = parseInt(limit as string, 10);

            const userId = await getId('accessToken', req)

            const getAllCourse = await this.mentorServices.mentorGetAllCourse(String(userId), pageNumber, limitNumber)

            SuccessResponse(res, 200, "All Courses Got It", getAllCourse)
            return
        } catch (error: unknown) {
            ErrorResponse(res, 500, 'Internal Server Error')
            return
        }
    }

    async mentorGetCourse(req: Request, res: Response): Promise<void> {
        try {
            const { courseId } = req.query
            const getCourse = await this.mentorServices.mentorGetCourse(String(courseId))
            SuccessResponse(res, 200, "Course Got It", getCourse)
            return;
        } catch (error: unknown) {
            ErrorResponse(res, 500, 'Internal Server Error')
            return
        }
    }

    async mentorEditCourse(req: Request, res: Response): Promise<void> {
        try {
            const courseId = req.query.courseId as string;

            const updatedFields: any = {
                courseName: req.body.courseName,
                description: req.body.description,
                category: req.body.category,
                level: req.body.level,
                duration: req.body.duration,
                price: req.body.price,
            };

            // Extract files if they exist (thumbnail and demo video)
            const files = req.files as any;
            const mediaFiles = files?.demoVideo || [];
            const thumbnailFile = files?.thumbnail ? files.thumbnail[0] : null;

            // Only update demo video if a new file is uploaded
            if (mediaFiles.length > 0) {
                const demoVideo = mediaFiles.map((file: any) => ({
                    type: 'video',
                    url: file.location,
                }));
                updatedFields.demoVideo = demoVideo;
            }

            // Only update thumbnail if a new file is uploaded
            if (thumbnailFile) {
                updatedFields.thumbnailUrl = thumbnailFile.location;
            }

            const editedCourse = await this.mentorServices.mentorEditCourse(String(courseId), updatedFields)

            SuccessResponse(res, 200, "Course Edited", editedCourse)
            return
        } catch (error: unknown) {
            if (error instanceof Error) {
                if (error.name === 'AlreadyExist') {
                    ErrorResponse(res, 403, "Already Exist")
                    return;
                }
            }
            ErrorResponse(res, 500, 'Internal Server Error')
            return
        }
    }

    async mentorUnPulishCourse(req: Request, res: Response): Promise<void> {
        try {
            const { courseId } = req.query
            const unPublish = await this.mentorServices.mentorUnPulishCourse(String(courseId))
            SuccessResponse(res, 200, "Course Unpublished", unPublish)
            return
        } catch (error: unknown) {
            ErrorResponse(res, 500, 'Internal Server Error')
            return
        }
    }

    async mentorPublishCourse(req: Request, res: Response): Promise<void> {
        try {
            const { courseId } = req.query
            const publish = await this.mentorServices.mentorPublishCourse(String(courseId))
            SuccessResponse(res, 200, "Course Published", publish)
            return
        } catch (error: unknown) {
            ErrorResponse(res, 500, 'Internal Server Error')
            return
        }
    }

    async mentorFilterCourse(req: Request, res: Response): Promise<void> {
        try {

            const { page = 1, limit = 6 } = req.query;
            const { searchTerm } = req.query

            const pageNumber = parseInt(page as string, 10);
            const limitNumber = parseInt(limit as string, 10);

            const filterCourse = await this.mentorServices.mentorFilterCourse(pageNumber, limitNumber, String(searchTerm))
            SuccessResponse(res, 200, "Filtered Course", filterCourse)
            return
        } catch (error: unknown) {
            if (error instanceof Error) {
                if (error.name === 'CourseNotFound') {
                    ErrorResponse(res, 200, "Course Not Found")
                    return
                }
            }
            ErrorResponse(res, 500, 'Internal Server Error')
            return
        }
    }

    async mentorGetAllCategorise(req: Request, res: Response): Promise<void> {
        try {
            const getAllCategories = await this.mentorServices.mentorGetAllCategorise()
            SuccessResponse(res, 200, "Categories Got It", getAllCategories)
            return;
        } catch (error: unknown) {
            ErrorResponse(res, 500, 'Internal Server Error')
            return
        }
    }

    async mentorAddChapter(req: Request, res: Response): Promise<void> {
        try {
            const { courseId } = req.query; // Extract courseId from the query
            const { title, description } = req.body;
            const file = req.file as any;
            const data: any = {
                chapterTitle: title,
                courseId,
                description,
                videoUrl: file.location,
            }
            const uploadChapter = await this.mentorServices.mentorAddChapter(data)
            SuccessResponse(res, 200, "Chapter Uploaded", uploadChapter)
            return
        } catch (error: unknown) {
            ErrorResponse(res, 500, 'Internal Server Error')
            return
        }
    }

    async mentorEditChapter(req: Request, res: Response): Promise<void> {
        try {
            const { chapterId } = req.query;
            const { title, description } = req.body;

            const file = req.file as any;
            const fileLocation = file?.location

            const data: any = {
                title,
                description,
                chapterId: String(chapterId),
                fileLocation
            }
            const editChapter = await this.mentorServices.mentorEditChapter(data)
            SuccessResponse(res, 200, "Chapter Edited", editChapter)
            return
        } catch (error: unknown) {
            ErrorResponse(res, 500, 'Internal Server Error')
            return
        }
    }

    async mentorGetAllChapters(req: Request, res: Response): Promise<void> {
        try {
            const { courseId } = req.query
            const getAllChapters = await this.mentorServices.mentorGetAllChapters(String(courseId))
            SuccessResponse(res, 200, "Chapters Got It", getAllChapters)
            return
        } catch (error: unknown) {
            ErrorResponse(res, 500, 'Internal Server Error')
            return
        }
    }

    async mentorAddQuizz(req: Request, res: Response): Promise<void> {
        try {
            const { courseId } = req.query;
            const data = req.body;
            const addQuizz = await this.mentorServices.mentorAddQuizz(data, String(courseId))
            SuccessResponse(res, 200, "Quiz Added", addQuizz)
            return
        } catch (error: unknown) {
            if (error instanceof Error) {
                if (error.name === 'QuestionAlreadyExist') {
                    ErrorResponse(res, 403, "Quizz Exists")
                    return
                }
            }
            ErrorResponse(res, 500, 'Internal Server Error')
            return
        }
    }

    async mentorGetAllQuizz(req: Request, res: Response): Promise<void> {
        try {
            const { courseId } = req.query
            const getAllQuizz = await this.mentorServices.mentorGetAllQuizz(String(courseId))
            SuccessResponse(res, 200, " Get All Quizz", getAllQuizz)
            return
        } catch (error: unknown) {
            ErrorResponse(res, 500, 'Internal Server Error')
            return
        }
    }

    async mentorDeleteQuizz(req: Request, res: Response): Promise<void> {
        try {
            const { courseId, quizId } = req.query
            const deleteQuizz = await this.mentorServices.mentorDeleteQuizz(String(courseId), String(quizId))
            SuccessResponse(res, 200, "Quiz Deleted", deleteQuizz)
            return
        } catch (error: unknown) {
            ErrorResponse(res, 500, 'Internal Server Error')
            return
        }
    }

    async mentorGetWallet(req: Request, res: Response): Promise<void> {
        try {
            const { page = 1, limit = 4 } = req.query;

            const pageNumber = parseInt(page as string, 10);
            const limitNumber = parseInt(limit as string, 10);

            const userId = await getId('accessToken', req)
            const getWallet = await this.mentorServices.mentorGetWallet(String(userId), Number(page), Number(limit))
            SuccessResponse(res, 200, "Wallet Got It", getWallet)
            return
        } catch (error: unknown) {
            ErrorResponse(res, 500, 'Internal Server Error')
            return
        }
    }


    /////////////////////////////////// WEEK - 3 //////////////////////////////////////
    
    async mentorChatGetRooms(req: Request, res: Response): Promise<void> {
        try {
            const mentorId = await getId('accessToken', req) as string
            const getRooms = await this.mentorServices.mentorChatGetRooms(mentorId)
            SuccessResponse(res, 200, "Rooms Got It", getRooms)
            return;
        } catch (error: unknown) {
            ErrorResponse(res, 500, 'Internal Server Error')
            return
        }
    }

    async mentorCreateRoom(req: Request, res: Response): Promise<void> {
        try {
            const { userId, mentorId } = req.body;
            const createRoom = await this.mentorServices.mentorCreateRoom(String(userId), String(mentorId))
            SuccessResponse(res, 200, "Room Created", createRoom)
            return
        } catch (error: unknown) {
            ErrorResponse(res, 500, 'Internal Server Error')
            return
        }
    }

    async mentorGetMessages(req: Request, res: Response): Promise<void> {
        try {
            const { roomId } = req.params
            const getMessages = await this.mentorServices.mentorGetMessages(String(roomId))
            SuccessResponse(res, 200, "Messages Got It", getMessages)
            return
        } catch (error: unknown) {
            if (error instanceof Error) {
                if (error.name === "MessageNotFound") {
                    ErrorResponse(res, 404, "Messages Not Found")
                    return;
                }
            }
            ErrorResponse(res, 500, 'Internal Server Error')
            return
        }
    }

    async mentorSaveMessage(req: Request, res: Response): Promise<void> {
        try {
            console.log('req.body ', req.body)
            const { message, roomId, receiverId } = req.body
            const senderId = await getId('accessToken', req) as string
            const savedMessage = await this.mentorServices.mentorSaveMessage(message, roomId, receiverId, senderId)
            console.log('savedMessage ', savedMessage)
            SuccessResponse(res, 200, "Message Saved", savedMessage)
            return;
        } catch (error: unknown) {
            ErrorResponse(res, 500, 'Internal Server Error')
            return
        }
    }
}
