"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const responseUtil_1 = require("../../utils/responseUtil");
const jwt_1 = require("../../integration/jwt");
const getId_1 = __importDefault(require("../../integration/getId"));
const mailToken_1 = require("../../integration/mailToken");
class MentorController {
    constructor(mentorServices) {
        this.mentorServices = mentorServices;
        this.jwtService = new jwt_1.JwtService();
    }
    //////////////////////////////////// WEEK - 1 //////////////////////////////////
    MentorLogin(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, password } = req.body;
                const logUser = yield this.mentorServices.mentorLogin(email, password);
                const accessToken = yield this.jwtService.createToken(logUser === null || logUser === void 0 ? void 0 : logUser._id, String(logUser === null || logUser === void 0 ? void 0 : logUser.role));
                const refreshToken = yield this.jwtService.createRefreshToken(logUser === null || logUser === void 0 ? void 0 : logUser._id, String(logUser === null || logUser === void 0 ? void 0 : logUser.role));
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
                });
                // SuccessResponse(res, 200, "Mentor Logged", logUser, String(accessToken), String(refreshToken))
                // return
            }
            catch (error) {
                if (error instanceof Error) {
                    if (error.name === 'PasswordInvalid' || error.name === 'EmailNotFound') {
                        (0, responseUtil_1.ErrorResponse)(res, 401, "Invalid Credentials");
                        return;
                    }
                    if (error.name === 'MentorBlocked') {
                        (0, responseUtil_1.ErrorResponse)(res, 403, "Mentor Blocked");
                        return;
                    }
                }
                (0, responseUtil_1.ErrorResponse)(res, 500, 'Internal Server Error');
                return;
            }
        });
    }
    mentorSignUp(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { username, email, phone, password, expertise, skills } = req.body;
                const addedMentor = yield this.mentorServices.mentorSignUp({
                    username,
                    email,
                    phone,
                    password,
                    expertise,
                    skills
                });
                const accessToken = yield this.jwtService.createToken(addedMentor === null || addedMentor === void 0 ? void 0 : addedMentor._id, String(addedMentor === null || addedMentor === void 0 ? void 0 : addedMentor.role));
                const refreshToken = yield this.jwtService.createRefreshToken(addedMentor === null || addedMentor === void 0 ? void 0 : addedMentor._id, String(addedMentor === null || addedMentor === void 0 ? void 0 : addedMentor.role));
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
                });
                // SuccessResponse(res, 200, "Mentor Added Successfully", addedMentor, String(accessToken), String(refreshToken))
                // return
            }
            catch (error) {
                console.info('singup error: ', error);
                if (error instanceof Error) {
                    if (error.name === 'MentorExist') {
                        (0, responseUtil_1.ErrorResponse)(res, 409, 'Mentor Already Exists');
                        return;
                    }
                }
                (0, responseUtil_1.ErrorResponse)(res, 500, 'Internal Server Error');
                return;
            }
        });
    }
    mentorGoogleSignUp(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, displayName } = req.body;
                const addedMentor = yield this.mentorServices.mentorGoogleSignUp(email, displayName);
                const accessToken = yield this.jwtService.createToken(addedMentor === null || addedMentor === void 0 ? void 0 : addedMentor._id, String(addedMentor === null || addedMentor === void 0 ? void 0 : addedMentor.role));
                const refreshToken = yield this.jwtService.createRefreshToken(addedMentor === null || addedMentor === void 0 ? void 0 : addedMentor._id, String(addedMentor === null || addedMentor === void 0 ? void 0 : addedMentor.role));
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
                });
                // SuccessResponse(res, 200, "Mentor Added SucessFully", addedMentor, String(accessToken), String(refreshToken))
                // return;
            }
            catch (error) {
                if (error instanceof Error) {
                    if (error.name === 'MentorExist') {
                        (0, responseUtil_1.ErrorResponse)(res, 409, 'Mentor Already Exists');
                        return;
                    }
                }
                (0, responseUtil_1.ErrorResponse)(res, 500, 'Internal Server Error');
                return;
            }
        });
    }
    mentorGoogleLogin(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email } = req.body;
                const logMentor = yield this.mentorServices.mentorGoogleLogin(email);
                const accessToken = yield this.jwtService.createToken(logMentor === null || logMentor === void 0 ? void 0 : logMentor._id, String(logMentor === null || logMentor === void 0 ? void 0 : logMentor.role));
                const refreshToken = yield this.jwtService.createRefreshToken(logMentor === null || logMentor === void 0 ? void 0 : logMentor._id, String(logMentor === null || logMentor === void 0 ? void 0 : logMentor.role));
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
                });
                // SuccessResponse(res, 200, "Mentor Logged", logMentor, String(accessToken), String(refreshToken))
                // return;
            }
            catch (error) {
                if (error instanceof Error) {
                    if (error.name === 'EmailNotFound') {
                        (0, responseUtil_1.ErrorResponse)(res, 401, "Invalid Credentials Please Signup");
                        return;
                    }
                    if (error.name === 'MentorBlocked') {
                        (0, responseUtil_1.ErrorResponse)(res, 403, "Mentor Blocked");
                        return;
                    }
                }
                (0, responseUtil_1.ErrorResponse)(res, 500, 'Internal Server Error');
                return;
            }
        });
    }
    mentorForgetPassword(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, password } = req.body;
                const updateMentor = yield this.mentorServices.mentorForgetPassword(email, password);
                (0, responseUtil_1.SuccessResponse)(res, 200, "Mentor Password updated", updateMentor);
                return;
            }
            catch (error) {
                if (error instanceof Error) {
                    if (error.name === "MentorNotFound") {
                        (0, responseUtil_1.ErrorResponse)(res, 404, "Mentor Not Found");
                        return;
                    }
                }
                (0, responseUtil_1.ErrorResponse)(res, 500, 'Internal Server Error');
                return;
            }
        });
    }
    mentorProfileUpdate(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const file = req.file;
                const { username, phone } = req.body;
                const data = {
                    username,
                    phone,
                    profilePicUrl: file === null || file === void 0 ? void 0 : file.location
                };
                const mentorId = yield (0, getId_1.default)('accessToken', req);
                const updatedProfile = yield this.mentorServices.mentorProfileUpdate(String(mentorId), data);
                (0, responseUtil_1.SuccessResponse)(res, 200, "Mentor Profile Updated", updatedProfile);
                return;
            }
            catch (error) {
                (0, responseUtil_1.ErrorResponse)(res, 500, 'Internal Server Error');
                return;
            }
        });
    }
    mentorCheck(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { userId } = req.query;
                const checkMentor = yield this.mentorServices.mentorCheck(String(userId));
                (0, responseUtil_1.SuccessResponse)(res, 200, "Mentor Got It", checkMentor);
                return;
            }
            catch (error) {
                (0, responseUtil_1.ErrorResponse)(res, 500, 'Internal Server Error');
                return;
            }
        });
    }
    mentorVerify(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const token = req.query.token;
                // Verify the token
                const verifiedToken = yield (0, mailToken_1.verifyToken)(token);
                console.log('Verified token:', verifiedToken);
                if (!verifiedToken.status) {
                    const error = new Error('Token Expired');
                    error.name = 'TokenExpired';
                    throw error;
                }
                const payload = verifiedToken.payload;
                // Ensure payload is valid
                if (!payload || typeof payload !== 'object' || !('id' in payload) || !('email' in payload)) {
                    const error = new Error('Invalid token payload');
                    error.name = 'InvalidTokenPayload';
                    throw error;
                }
                const { email } = payload;
                const verifyUser = yield this.mentorServices.mentorVerify(String(email));
                (0, responseUtil_1.SuccessResponse)(res, 200, "User Verified", verifyUser);
                return;
            }
            catch (error) {
                console.info('mentor verify error: ', error);
                if (error instanceof Error) {
                    if (error.name === 'TokenExpired') {
                        (0, responseUtil_1.ErrorResponse)(res, 401, "Token Expired");
                        return;
                    }
                    if (error.name === 'InvalidTokenPayload') {
                        (0, responseUtil_1.ErrorResponse)(res, 401, 'Invalid token payload');
                        return;
                    }
                }
                (0, responseUtil_1.ErrorResponse)(res, 500, 'Internal Server Error');
                return;
            }
        });
    }
    mentorReVerify(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const email = req.query.email;
                const verifiyed = yield this.mentorServices.mentorReVerify(String(email));
                (0, responseUtil_1.SuccessResponse)(res, 200, "User Verified", verifiyed);
                return;
            }
            catch (error) {
                console.info('mentor verify error: ', error);
                (0, responseUtil_1.ErrorResponse)(res, 500, 'Internal Server Error');
                return;
            }
        });
    }
    //////////////////////////////////// WEEK - 2 ///////////////////////////////////
    mentorAddCourse(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('req.body addcourse ', req.body);
                // Map demo videos
                const demoVideo = [{
                        type: 'video',
                        url: req.body.demoVideoUrl,
                    }];
                const mentorId = yield (0, getId_1.default)('accessToken', req);
                // Append processed fields to request body
                req.body.demoVideo = demoVideo;
                req.body.mentorId = String(mentorId);
                const data = req.body;
                const addCourse = yield this.mentorServices.mentorAddCourse(data);
                (0, responseUtil_1.SuccessResponse)(res, 200, "Course Added Successfully", addCourse);
                // // Extract files
                // const files = req.files as any;
                // const mediaFiles = files?.demoVideo || [];
                // const thumbnailFile = files?.thumbnail ? files.thumbnail[0] : null;
                // // Map demo videos
                // const demoVideo = mediaFiles.map((file: any) => ({
                //     type: 'video',
                //     url: file.location,
                // }));
                // // Extract thumbnail URL
                // const thumbnailUrl = thumbnailFile ? thumbnailFile.location : null;
                // const mentorId = await getId('accessToken', req)
                // // Append processed fields to request body
                // req.body.demoVideo = demoVideo;
                // req.body.thumbnailUrl = thumbnailUrl;
                // req.body.mentorId = String(mentorId)
                // const data = req.body
                // const addCourse = await this.mentorServices.mentorAddCourse(data)
                // SuccessResponse(res, 200, "Course Added Successfully", addCourse)
                return;
            }
            catch (error) {
                if (error instanceof Error) {
                    if (error.name === 'AlreadyExist') {
                        (0, responseUtil_1.ErrorResponse)(res, 403, "Course Already Exist");
                        return;
                    }
                }
                (0, responseUtil_1.ErrorResponse)(res, 500, 'Internal Server Error');
                return;
            }
        });
    }
    mentorGetAllCourse(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { page = 1, limit = 4 } = req.query;
                const pageNumber = parseInt(page, 10);
                const limitNumber = parseInt(limit, 10);
                const userId = yield (0, getId_1.default)('accessToken', req);
                const getAllCourse = yield this.mentorServices.mentorGetAllCourse(String(userId), pageNumber, limitNumber);
                (0, responseUtil_1.SuccessResponse)(res, 200, "All Courses Got It", getAllCourse);
                return;
            }
            catch (error) {
                (0, responseUtil_1.ErrorResponse)(res, 500, 'Internal Server Error');
                return;
            }
        });
    }
    mentorGetCourse(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { courseId } = req.query;
                const getCourse = yield this.mentorServices.mentorGetCourse(String(courseId));
                (0, responseUtil_1.SuccessResponse)(res, 200, "Course Got It", getCourse);
                return;
            }
            catch (error) {
                (0, responseUtil_1.ErrorResponse)(res, 500, 'Internal Server Error');
                return;
            }
        });
    }
    mentorEditCourse(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const courseId = req.query.courseId;
                const updatedFields = {
                    courseName: req.body.courseName,
                    description: req.body.description,
                    category: req.body.category,
                    level: req.body.level,
                    duration: req.body.duration,
                    price: req.body.price,
                };
                // Extract files if they exist (thumbnail and demo video)
                const files = req.files;
                const mediaFiles = (files === null || files === void 0 ? void 0 : files.demoVideo) || [];
                const thumbnailFile = (files === null || files === void 0 ? void 0 : files.thumbnail) ? files.thumbnail[0] : null;
                // Only update demo video if a new file is uploaded
                if (mediaFiles.length > 0) {
                    const demoVideo = mediaFiles.map((file) => ({
                        type: 'video',
                        url: file.location,
                    }));
                    updatedFields.demoVideo = demoVideo;
                }
                // Only update thumbnail if a new file is uploaded
                if (thumbnailFile) {
                    updatedFields.thumbnailUrl = thumbnailFile.location;
                }
                const editedCourse = yield this.mentorServices.mentorEditCourse(String(courseId), updatedFields);
                (0, responseUtil_1.SuccessResponse)(res, 200, "Course Edited", editedCourse);
                return;
            }
            catch (error) {
                if (error instanceof Error) {
                    if (error.name === 'AlreadyExist') {
                        (0, responseUtil_1.ErrorResponse)(res, 403, "Already Exist");
                        return;
                    }
                }
                (0, responseUtil_1.ErrorResponse)(res, 500, 'Internal Server Error');
                return;
            }
        });
    }
    mentorUnPulishCourse(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { courseId } = req.query;
                const unPublish = yield this.mentorServices.mentorUnPulishCourse(String(courseId));
                (0, responseUtil_1.SuccessResponse)(res, 200, "Course Unpublished", unPublish);
                return;
            }
            catch (error) {
                (0, responseUtil_1.ErrorResponse)(res, 500, 'Internal Server Error');
                return;
            }
        });
    }
    mentorPublishCourse(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { courseId } = req.query;
                const publish = yield this.mentorServices.mentorPublishCourse(String(courseId));
                (0, responseUtil_1.SuccessResponse)(res, 200, "Course Published", publish);
                return;
            }
            catch (error) {
                (0, responseUtil_1.ErrorResponse)(res, 500, 'Internal Server Error');
                return;
            }
        });
    }
    mentorFilterCourse(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { page = 1, limit = 6 } = req.query;
                const { searchTerm } = req.query;
                const pageNumber = parseInt(page, 10);
                const limitNumber = parseInt(limit, 10);
                const filterCourse = yield this.mentorServices.mentorFilterCourse(pageNumber, limitNumber, String(searchTerm));
                (0, responseUtil_1.SuccessResponse)(res, 200, "Filtered Course", filterCourse);
                return;
            }
            catch (error) {
                if (error instanceof Error) {
                    if (error.name === 'CourseNotFound') {
                        (0, responseUtil_1.ErrorResponse)(res, 200, "Course Not Found");
                        return;
                    }
                }
                (0, responseUtil_1.ErrorResponse)(res, 500, 'Internal Server Error');
                return;
            }
        });
    }
    mentorGetAllCategorise(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const getAllCategories = yield this.mentorServices.mentorGetAllCategorise();
                (0, responseUtil_1.SuccessResponse)(res, 200, "Categories Got It", getAllCategories);
                return;
            }
            catch (error) {
                (0, responseUtil_1.ErrorResponse)(res, 500, 'Internal Server Error');
                return;
            }
        });
    }
    mentorAddChapter(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { courseId } = req.query; // Extract courseId from the query
                const { title, description } = req.body;
                const file = req.file;
                const data = {
                    chapterTitle: title,
                    courseId,
                    description,
                    videoUrl: file.location,
                };
                const uploadChapter = yield this.mentorServices.mentorAddChapter(data);
                (0, responseUtil_1.SuccessResponse)(res, 200, "Chapter Uploaded", uploadChapter);
                return;
            }
            catch (error) {
                (0, responseUtil_1.ErrorResponse)(res, 500, 'Internal Server Error');
                return;
            }
        });
    }
    mentorEditChapter(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { chapterId } = req.query;
                const { title, description } = req.body;
                const file = req.file;
                const fileLocation = file === null || file === void 0 ? void 0 : file.location;
                const data = {
                    title,
                    description,
                    chapterId: String(chapterId),
                    fileLocation
                };
                const editChapter = yield this.mentorServices.mentorEditChapter(data);
                (0, responseUtil_1.SuccessResponse)(res, 200, "Chapter Edited", editChapter);
                return;
            }
            catch (error) {
                (0, responseUtil_1.ErrorResponse)(res, 500, 'Internal Server Error');
                return;
            }
        });
    }
    mentorGetAllChapters(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { courseId } = req.query;
                const getAllChapters = yield this.mentorServices.mentorGetAllChapters(String(courseId));
                (0, responseUtil_1.SuccessResponse)(res, 200, "Chapters Got It", getAllChapters);
                return;
            }
            catch (error) {
                (0, responseUtil_1.ErrorResponse)(res, 500, 'Internal Server Error');
                return;
            }
        });
    }
    mentorAddQuizz(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { courseId } = req.query;
                const data = req.body;
                const addQuizz = yield this.mentorServices.mentorAddQuizz(data, String(courseId));
                (0, responseUtil_1.SuccessResponse)(res, 200, "Quiz Added", addQuizz);
                return;
            }
            catch (error) {
                if (error instanceof Error) {
                    if (error.name === 'QuestionAlreadyExist') {
                        (0, responseUtil_1.ErrorResponse)(res, 403, "Quizz Exists");
                        return;
                    }
                }
                (0, responseUtil_1.ErrorResponse)(res, 500, 'Internal Server Error');
                return;
            }
        });
    }
    mentorGetAllQuizz(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { courseId } = req.query;
                const getAllQuizz = yield this.mentorServices.mentorGetAllQuizz(String(courseId));
                (0, responseUtil_1.SuccessResponse)(res, 200, " Get All Quizz", getAllQuizz);
                return;
            }
            catch (error) {
                (0, responseUtil_1.ErrorResponse)(res, 500, 'Internal Server Error');
                return;
            }
        });
    }
    mentorDeleteQuizz(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { courseId, quizId } = req.query;
                const deleteQuizz = yield this.mentorServices.mentorDeleteQuizz(String(courseId), String(quizId));
                (0, responseUtil_1.SuccessResponse)(res, 200, "Quiz Deleted", deleteQuizz);
                return;
            }
            catch (error) {
                (0, responseUtil_1.ErrorResponse)(res, 500, 'Internal Server Error');
                return;
            }
        });
    }
    mentorGetWallet(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { page = 1, limit = 4 } = req.query;
                const pageNumber = parseInt(page, 10);
                const limitNumber = parseInt(limit, 10);
                const userId = yield (0, getId_1.default)('accessToken', req);
                const getWallet = yield this.mentorServices.mentorGetWallet(String(userId), Number(page), Number(limit));
                (0, responseUtil_1.SuccessResponse)(res, 200, "Wallet Got It", getWallet);
                return;
            }
            catch (error) {
                (0, responseUtil_1.ErrorResponse)(res, 500, 'Internal Server Error');
                return;
            }
        });
    }
    /////////////////////////////////// WEEK - 3 //////////////////////////////////////
    mentorChatGetStudents(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const mentorId = (0, getId_1.default)("accessToken", req);
                const getStudent = yield this.mentorServices.mentorChatGetStudents(mentorId);
                (0, responseUtil_1.SuccessResponse)(res, 200, "Students Got It", getStudent);
                return;
            }
            catch (error) {
                (0, responseUtil_1.ErrorResponse)(res, 500, 'Internal Server Error');
                return;
            }
        });
    }
    mentorGetMessages(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { studentId } = req.params;
                const mentorId = (0, getId_1.default)("accessToken", req);
                const getMessage = yield this.mentorServices.mentorGetMessages(String(studentId), mentorId);
                (0, responseUtil_1.SuccessResponse)(res, 200, "Messages Got It", getMessage);
                return;
            }
            catch (error) {
                (0, responseUtil_1.ErrorResponse)(res, 500, 'Internal Server Error');
                return;
            }
        });
    }
    mentorSaveMessage(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { message, studentId } = req.body;
                const mentorId = (0, getId_1.default)("accessToken", req);
                const saveMessage = yield this.mentorServices.mentorSaveMessage(studentId, String(mentorId), String(message));
                (0, responseUtil_1.SuccessResponse)(res, 200, "Message saved", saveMessage);
                return;
            }
            catch (error) {
                (0, responseUtil_1.ErrorResponse)(res, 500, 'Internal Server Error');
                return;
            }
        });
    }
    mentorCreateRoom(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { studentId } = req.body;
                const mentorId = (0, getId_1.default)("accessToken", req);
                const createdRoom = yield this.mentorServices.mentorCreateRoom(String(studentId), mentorId);
                (0, responseUtil_1.SuccessResponse)(res, 200, "Room Created", createdRoom);
                return;
            }
            catch (error) {
                (0, responseUtil_1.ErrorResponse)(res, 500, 'Internal Server Error');
                return;
            }
        });
    }
    mentorDeleteEveryOne(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { messageId } = req.params;
                const deleteForEveryOne = yield this.mentorServices.mentorDeleteEveryOne(String(messageId));
                (0, responseUtil_1.SuccessResponse)(res, 200, "Message Deleted For EveryOne", deleteForEveryOne);
                return;
            }
            catch (error) {
                (0, responseUtil_1.ErrorResponse)(res, 500, 'Internal Server Error');
                return;
            }
        });
    }
    mentorDeleteForMe(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { messageId } = req.params;
                const deleteForMe = yield this.mentorServices.mentorDeleteForMe(String(messageId));
                (0, responseUtil_1.SuccessResponse)(res, 200, "Message Deleted For Me", deleteForMe);
                return;
            }
            catch (error) {
                (0, responseUtil_1.ErrorResponse)(res, 500, 'Internal Server Error');
                return;
            }
        });
    }
    mentorResetCount(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { studentId } = req.params;
                const mentorId = yield (0, getId_1.default)('accessToken', req);
                const resetCount = yield this.mentorServices.mentorResetCount(String(studentId), mentorId);
                (0, responseUtil_1.SuccessResponse)(res, 200, "count reset", resetCount);
                return;
            }
            catch (error) {
                (0, responseUtil_1.ErrorResponse)(res, 500, 'Internal Server Error');
                return;
            }
        });
    }
    //Notifications
    mentorCreateNotification(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { username, senderId, receiverId } = req.body;
                const createNotify = yield this.mentorServices.mentorCreateNotification(String(username), String(senderId), String(receiverId));
                (0, responseUtil_1.SuccessResponse)(res, 200, "notification created", createNotify);
                return;
            }
            catch (error) {
                (0, responseUtil_1.ErrorResponse)(res, 500, 'Internal Server Error');
                return;
            }
        });
    }
    mentorGetNotificationsCount(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { mentorId } = req.params;
                const getCount = yield this.mentorServices.mentorGetNotificationsCount(String(mentorId));
                (0, responseUtil_1.SuccessResponse)(res, 200, "count get it", getCount);
                return;
            }
            catch (error) {
                (0, responseUtil_1.ErrorResponse)(res, 500, 'Internal Server Error');
                return;
            }
        });
    }
    mentorGetNotifications(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { mentorId } = req.params;
                const getNotify = yield this.mentorServices.mentorGetNotifications(String(mentorId));
                (0, responseUtil_1.SuccessResponse)(res, 200, "get Notificaton", getNotify);
                return;
            }
            catch (error) {
                (0, responseUtil_1.ErrorResponse)(res, 500, 'Internal Server Error');
                return;
            }
        });
    }
    mentorGetNotificationsSeen(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const notifySeen = yield this.mentorServices.mentorGetNotificationsSeen();
                (0, responseUtil_1.SuccessResponse)(res, 200, "Notificaton seen", notifySeen);
                return;
            }
            catch (error) {
                (0, responseUtil_1.ErrorResponse)(res, 500, 'Internal Server Error');
                return;
            }
        });
    }
    mentorDeleteNotifications(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { senderId } = req.params;
                const deleteNotify = yield this.mentorServices.mentorDeleteNotifications(String(senderId));
                (0, responseUtil_1.SuccessResponse)(res, 200, "Notificaton deleted", deleteNotify);
                return;
            }
            catch (error) {
                (0, responseUtil_1.ErrorResponse)(res, 500, 'Internal Server Error');
                return;
            }
        });
    }
    mentorGetStudent(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { studentId } = req.params;
                const mentorId = yield (0, getId_1.default)("accessToken", req);
                const getStudent = yield this.mentorServices.mentorGetStudent(String(studentId), mentorId);
                (0, responseUtil_1.SuccessResponse)(res, 200, "Student get it", getStudent);
                return;
            }
            catch (error) {
                (0, responseUtil_1.ErrorResponse)(res, 500, 'Internal Server Error');
                return;
            }
        });
    }
    ////////////////////////////////// WEEK - 4 ////////////////////
    mentorDashboard(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const mentorId = yield (0, getId_1.default)('accessToken', req);
                const getDashboard = yield this.mentorServices.mentorDashboard(mentorId);
                (0, responseUtil_1.SuccessResponse)(res, 200, "Dashborad data got it", getDashboard);
                return;
            }
            catch (error) {
                (0, responseUtil_1.ErrorResponse)(res, 500, 'Internal Server Error');
                return;
            }
        });
    }
    mentorChartGraph(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const filters = req.query.filter ? JSON.parse(req.query.filter) : {};
                const mentorId = yield (0, getId_1.default)('accessToken', req);
                const getChart = yield this.mentorServices.mentorChartGraph(mentorId, filters);
                (0, responseUtil_1.SuccessResponse)(res, 200, "Graph Chart data got it", getChart);
                return;
            }
            catch (error) {
                (0, responseUtil_1.ErrorResponse)(res, 500, 'Internal Server Error');
                return;
            }
        });
    }
    mentorSalesReport(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const filters = req.query.filter ? JSON.parse(req.query.filter) : {};
                const mentorId = yield (0, getId_1.default)('accessToken', req);
                const getChart = yield this.mentorServices.mentorSalesReport(mentorId, filters);
                (0, responseUtil_1.SuccessResponse)(res, 200, "Sales Report got it", getChart);
                return;
            }
            catch (error) {
                console.info('mentor report: ', error);
                (0, responseUtil_1.ErrorResponse)(res, 500, 'Internal Server Error');
                return;
            }
        });
    }
}
exports.default = MentorController;
