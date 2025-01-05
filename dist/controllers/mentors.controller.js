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
exports.MentorController = void 0;
const mentorService_1 = require("../services/mentorService");
const jwt_1 = require("../integration/jwt");
const bcrypt_1 = __importDefault(require("bcrypt"));
const getId_1 = __importDefault(require("../integration/getId"));
const mailToken_1 = require("../integration/mailToken");
const uploadCourse_model_1 = require("../models/uploadCourse.model");
const chapter_model_1 = require("../models/chapter.model");
class MentorController {
    constructor() {
        this.mentorServices = new mentorService_1.MentorServices();
        this.jwtService = new jwt_1.JwtService();
    }
    /* ------------------------------- WEEK 1 ---------------------------*/
    mentorSignUp(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let { username, email, phone, password, expertise, skills } = req.body;
                const saltRound = 10;
                const hashPassword = yield bcrypt_1.default.hash(password, saltRound);
                password = hashPassword;
                const ExistMentor = yield this.mentorServices.findByEmail(email);
                if (ExistMentor) {
                    return res.status(409).send({ message: 'Mentor Already Exist', success: false });
                }
                const addedMentor = yield this.mentorServices.mentorSignUp({
                    username, email, phone, password, expertise, skills
                });
                if (addedMentor) {
                    const userJwtToken = yield this.jwtService.createToken(addedMentor._id, addedMentor.role);
                    const userRefreshToken = yield this.jwtService.createRefreshToken(addedMentor._id, addedMentor.role);
                    return res
                        .status(201)
                        .cookie('accessToken', userJwtToken, {
                        httpOnly: false
                    }).cookie('refreshToken', userRefreshToken, {
                        httpOnly: true
                    })
                        .send({
                        success: true,
                        message: 'Mentor Added Successfully',
                        user: addedMentor
                    });
                }
                //  return res.status(201).send({user: addedMentor, message: 'Mentor Added Successfully', success: true })
            }
            catch (error) {
                console.log(error.message);
            }
        });
    }
    mentorLogin(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, password } = req.body;
                const loggedMentor = yield this.mentorServices.mentorLogin(email, password);
                if (loggedMentor === null) {
                    return res.status(401).send({ message: 'Invalid Credentials', success: false });
                }
                const isBlocked = loggedMentor === null || loggedMentor === void 0 ? void 0 : loggedMentor.isBlocked;
                if (isBlocked) {
                    return res.status(403).send({
                        message: 'Mentor Blocked',
                        success: false
                    });
                }
                const userJwtToken = yield this.jwtService.createToken(loggedMentor._id, String(loggedMentor.role));
                const userRefreshToken = yield this.jwtService.createRefreshToken(loggedMentor._id, String(loggedMentor.role));
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
                    user: loggedMentor
                });
            }
            catch (error) {
                console.error(error);
            }
        });
    }
    forgetPassword(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = req.body;
                const response = yield this.mentorServices.forgetPassword(data);
                if (!response) {
                    return res
                        .status(401)
                        .send({
                        message: 'Invalid Email',
                        success: true
                    });
                }
                return res
                    .status(200)
                    .send({
                    message: 'Password Updated',
                    success: true,
                    user: response
                });
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    mentorGoogleLogin(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email } = req.body;
                const addMentor = yield this.mentorServices.mentorGoogleLogin(email);
                if (!addMentor) {
                    return res.status(403).send({
                        message: 'Google User Not Found Please Go to Signup Page',
                        success: false
                    });
                }
                if ((addMentor === null || addMentor === void 0 ? void 0 : addMentor.isBlocked) === true) {
                    return res.status(403).send({
                        message: 'You Are Blocked',
                        success: false
                    });
                }
                if (addMentor && addMentor.role) {
                    const userJwtToken = yield this.jwtService.createToken(addMentor._id, addMentor.role);
                    const userRefreshToken = yield this.jwtService.createRefreshToken(addMentor._id, addMentor.role);
                    return res
                        .status(201)
                        .cookie('accessToken', userJwtToken, {
                        httpOnly: false
                    }).cookie('refreshToken', userRefreshToken, {
                        httpOnly: true
                    })
                        .send({
                        success: true,
                        message: 'Google Logined Successfully',
                        user: addMentor
                    });
                }
            }
            catch (error) {
                console.error(error.message);
            }
        });
    }
    mentorGoogleSignUp(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, displayName } = req.body;
                const ExistUser = yield this.mentorServices.findByEmail(email);
                if (ExistUser) {
                    return res.status(409).send({ message: 'User Already Exist', success: false });
                }
                const addMentor = yield this.mentorServices.mentorGoogleSignUp(email, displayName);
                if (addMentor && addMentor.role) {
                    const userJwtToken = yield this.jwtService.createToken(addMentor._id, addMentor.role);
                    const userRefreshToken = yield this.jwtService.createRefreshToken(addMentor._id, addMentor.role);
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
                        user: addMentor
                    });
                }
            }
            catch (error) {
                console.error(error.message);
            }
        });
    }
    profileUpdate(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { username, phone } = req.body;
                const data = {
                    username,
                    phone
                };
                const userId = yield (0, getId_1.default)('accessToken', req);
                const response = yield this.mentorServices.profileUpdate(String(userId), data);
                if (response) {
                    return res.status(201).send({
                        message: 'Mentor Updated',
                        success: true,
                        user: response
                    });
                }
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    checkMentor(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = req.query.userId;
                const response = yield this.mentorServices.checkMentor(String(id));
                // if(response){
                //     const isBlocked = await this.mentorServices.isUserBlocked(String(response.email))
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
                });
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    verifyMentor(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const token = req.query.token;
                // Verify the token
                const verifiedToken = yield (0, mailToken_1.verifyToken)(token);
                console.log('Verified token:', verifiedToken);
                if (!verifiedToken.status) {
                    console.log('token expired');
                    // throw new Error(verifiedToken.message || 'Token verification failed');
                    return res.status(401).send({
                        message: 'Token Expired',
                        status: false
                    });
                }
                const payload = verifiedToken.payload;
                // Ensure payload is valid
                if (!payload || typeof payload !== 'object' || !('id' in payload) || !('email' in payload)) {
                    throw new Error('Invalid token payload');
                }
                const { email } = payload;
                // Verify user using the email
                const response = yield this.mentorServices.verifyMentor(email);
                if (!response) {
                    throw new Error('User not found or verification failed');
                }
                return res.status(201).send({ success: true, message: 'Mentor verified successfully' });
            }
            catch (error) {
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
        });
    }
    mentorReVerify(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const email = req.query.email;
                const response = yield this.mentorServices.mentorReVerify(String(email));
                return res.status(200).send({
                    message: 'Verification Mail sent Successfully',
                    success: true,
                    user: response
                });
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    /* ------------------------------- WEEK 2 ---------------------------*/
    addCourse(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('Request files: ', req.files);
                console.log('Request body: ', req.body);
                // Extract files
                const files = req.files;
                const mediaFiles = (files === null || files === void 0 ? void 0 : files.demoVideo) || [];
                const thumbnailFile = (files === null || files === void 0 ? void 0 : files.thumbnail) ? files.thumbnail[0] : null;
                // Map demo videos
                const demoVideo = mediaFiles.map((file) => ({
                    type: 'video',
                    url: file.location,
                }));
                // Extract thumbnail URL
                const thumbnailUrl = thumbnailFile ? thumbnailFile.location : null;
                // Append processed fields to request body
                req.body.demoVideo = demoVideo;
                req.body.thumbnailUrl = thumbnailUrl;
                // Create and save the course
                const result = yield uploadCourse_model_1.CourseModel.create(req.body);
                // Respond with success
                return res.status(200).send({
                    message: 'Course uploaded successfully',
                    success: true,
                    result,
                });
            }
            catch (error) {
                console.error('Error in addCourse:', error);
                return res.status(500).send({
                    message: 'An error occurred while uploading the course',
                    success: false,
                    error: error.message,
                });
            }
        });
    }
    addChapter(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('req file: ', req.file);
                console.log('req body: ', req.body);
                const { courseId } = req.query; // Extract courseId from the query
                const { title, description } = req.body;
                // Validate courseId
                if (!courseId) {
                    return res.status(400).send({
                        message: 'Course ID is required',
                        success: false,
                    });
                }
                // Validate the file
                const file = req.file;
                if (!file || !file.location) {
                    return res.status(400).send({
                        message: 'Chapter video file is required',
                        success: false,
                    });
                }
                // Create a new chapter
                const newChapter = yield chapter_model_1.ChapterModel.create({
                    chapterTitle: title,
                    courseId,
                    description,
                    videoUrl: file.location,
                });
                // Update the course to include this chapter's ID in the fullVideo array
                yield uploadCourse_model_1.CourseModel.findByIdAndUpdate(courseId, {
                    $push: {
                        fullVideo: { chapterId: newChapter._id },
                    },
                }, { new: true } // Return the updated document
                );
                // Respond with success
                return res.status(201).send({
                    message: 'Chapter added successfully',
                    success: true,
                    chapter: newChapter,
                });
            }
            catch (error) {
                console.error('Error in addChapter:', error);
                return res.status(500).send({
                    message: 'An error occurred while adding the chapter',
                    success: false,
                    error: error.message,
                });
            }
        });
    }
    getAllCourses(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this.mentorServices.getAllCourses();
                return res
                    .status(200)
                    .send({
                    message: 'Courses Fetched Successfully',
                    success: true,
                    result: response
                });
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    getCourse(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { courseId } = req.query;
                const response = yield this.mentorServices.getCourse(String(courseId));
                if (response) {
                    return res
                        .status(200)
                        .send({
                        message: 'Course Got it',
                        successs: true,
                        data: response
                    });
                }
            }
            catch (error) {
            }
        });
    }
    getAllCategory(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this.mentorServices.getAllCategory();
                return res
                    .status(200)
                    .send({
                    message: 'All Categories were Got it',
                    success: true,
                    data: response
                });
            }
            catch (error) {
                throw error;
            }
        });
    }
    getAllChapters(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { courseId } = req.query;
                const response = yield this.mentorServices.getAllChapters(String(courseId));
                return res
                    .status(200)
                    .send({
                    message: 'All Chapters were Got it',
                    success: true,
                    data: response
                });
            }
            catch (error) {
                throw error;
            }
        });
    }
    addQuizz(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { courseId } = req.query;
                const data = req.body;
                const response = yield this.mentorServices.addQuizz(data, String(courseId));
                if (response) {
                    return res
                        .status(200)
                        .send({
                        message: 'Quiz Added Successfully',
                        success: true,
                        data: response,
                    });
                }
            }
            catch (error) {
                // console.error('Error adding quiz:', error);
                if (error && error.name === 'QuestionAlreadyExist') {
                    return res
                        .status(403)
                        .send({
                        message: 'Question Already Exist',
                        success: false
                    });
                }
                return res.status(500).send({
                    message: 'Failed to add quiz',
                    success: false,
                    error: error.message,
                });
            }
        });
    }
    getAllQuizz(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { courseId } = req.query;
                const response = yield this.mentorServices.getAllQuizz(String(courseId));
                return res
                    .status(200)
                    .send({
                    message: 'All Quizzez were Got it',
                    success: true,
                    data: response
                });
            }
            catch (error) {
                throw error;
            }
        });
    }
    deleteQuizz(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { courseId, quizId } = req.query;
                const response = yield this.mentorServices.deleteQuizz(String(courseId), String(quizId));
                if (response) {
                    return res
                        .status(200)
                        .send({
                        message: 'Quizz Deleted Successfully',
                        success: true,
                        data: response
                    });
                }
            }
            catch (error) {
                throw error;
            }
        });
    }
    editCourse(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            // try {
            //     console.log('query: ', req.query);
            //     console.log('req files: ', req.files);
            //     console.log('req body: ', req.body);
            //     // Extract courseId from query
            //     const courseId = req.query.courseId as string;
            //     if (!courseId) {
            //         return res.status(400).send({
            //             message: 'Course ID is required',
            //             success: false,
            //         });
            //     }
            //     // Find course to update
            //     const findCourseToUpdate = await CourseModel.findById(courseId);
            //     if (!findCourseToUpdate) {
            //         return res.status(404).send({
            //             message: 'Course Not Found',
            //             success: false,
            //         });
            //     }
            //     // Extract files from request
            //     const files = req.files as any;
            //     const mediaFiles = files?.demoVideo || [];
            //     const thumbnailFile = files?.thumbnail ? files.thumbnail[0] : null;
            //     // Map demo videos to include URL and type
            //     const demoVideo = mediaFiles.map((file: any) => ({
            //         type: 'video',
            //         url: file.location,
            //     }));
            //     // Extract thumbnail URL if available
            //     const thumbnailUrl = thumbnailFile ? thumbnailFile.location : findCourseToUpdate.thumbnailUrl;
            //     // Prepare updated course data
            //     const updatedData: any = {
            //         ...req.body, // Include any text fields from the body
            //         demoVideo: demoVideo.length ? demoVideo : findCourseToUpdate.demoVideo, // Use existing demo videos if no new ones
            //         thumbnailUrl, // Use existing thumbnail if no new one
            //     };
            //     // Update the course
            //     const updatedCourse = await CourseModel.findByIdAndUpdate(courseId, updatedData, {
            //         new: true, // Return the updated document
            //     });
            //     return res.status(200).send({
            //         message: 'Course updated successfully',
            //         success: true,
            //         data: updatedCourse,
            //     });
            // } catch (error: any) {
            //     console.error('Error updating course:', error);
            //     return res.status(500).send({
            //         message: 'An error occurred while updating the course',
            //         success: false,
            //         error: error.message,
            //     });
            // }
            try {
                console.log('query: ', req.query);
                console.log('req files: ', req.files);
                console.log('req body: ', req.body);
                // Extract courseId from query
                const courseId = req.query.courseId;
                // Find the course to update
                const findCourseToUpdate = yield uploadCourse_model_1.CourseModel.findById(courseId);
                if (!findCourseToUpdate) {
                    return res.status(404).send({
                        message: 'Course Not Found',
                        success: false,
                    });
                }
                // Initialize fields to update from req.body
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
                // Update course with new fields
                const updatedCourse = yield uploadCourse_model_1.CourseModel.findByIdAndUpdate(courseId, updatedFields, { new: true });
                if (!updatedCourse) {
                    return res.status(400).send({
                        message: 'Failed to update course',
                        success: false,
                    });
                }
                // Send response back
                return res.status(200).send({
                    message: 'Course updated successfully',
                    success: true,
                    data: updatedCourse,
                });
            }
            catch (error) {
                console.error('Error:', error);
                return res.status(500).send({
                    message: 'Internal Server Error',
                    success: false,
                });
            }
        });
    }
}
exports.MentorController = MentorController;
