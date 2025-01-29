import mongoose from "mongoose";
import { IMentorMethods } from "../../interface/mentors/mentor.interface";
import { MentorAddChapterInput, MentorAddQuizInput, MentorChatGetRoomsOutput, MentorEditChapterInput, MentorEditCourseInput, mentorFilterCourse, mentorGetALlCourseOuput, MentorProfileUpdateInput, MentorSignUpInput, mentorWalletOutput } from "../../interface/mentors/mentor.types";
import { CategoryModel, ICategory } from "../../models/categroy.model";
import { ChapterModel, IChapter } from "../../models/chapter.model";
import { ChatRoomsModel, IChatRooms } from "../../models/chatRooms.model";
import MentorModel, { IMentor } from "../../models/mentor.model";
import { IMessages, MessageModel } from "../../models/messages.model";
import QuizModel, { IQuiz } from "../../models/quizz.model";
import { CourseModel, ICourse } from "../../models/uploadCourse.model";
import { IMentorWallet, MentorWalletModel } from "../../models/mentorWallet.model";

export default class MentorRepository implements IMentorMethods {

    //////////////////////// WEEK - 1 ////////////////////////////////////

    async mentorLogin(email: string, password: string): Promise<IMentor | null> {
        try {
            const logUesr = await MentorModel.findOne({ email: email })
            return logUesr
        } catch (error: unknown) {
            throw error
        }
    }

    async mentorSignUp(userData: MentorSignUpInput): Promise<IMentor | null> {
        try {
            const existUser = await MentorModel.findOne({ email: userData.email })
            if (existUser) {
                const error = new Error('Mentor Already Exist')
                error.name = 'MentorExist'
                throw error
            }

            const { username, email, phone, password, expertise, skills } = userData;
            const modifiedUser = {
                username,
                email,
                phone,
                password,
                expertise,
                skills,
                role: 'mentor',
            };
            const newMentor = new MentorModel(modifiedUser)
            await newMentor.save()
            return newMentor
        } catch (error: unknown) {
            throw error
        }
    }

    async mentorGoogleSignUp(email: string, displayName: string): Promise<IMentor | null> {
        try {
            const existMentor = await MentorModel.findOne({ email })
            if (existMentor) {
                const error = new Error('Mentor Already Exist')
                error.name = 'MentorExist'
                throw error
            }

            const data = {
                username: displayName,
                email,
                phone: 'Not Provided',
                expertise: 'Not Provided',
                skills: 'Not Provided',
                password: 'null',
                role: 'mentor',
                isVerified: true
            }
            const document = new MentorModel(data)
            const savedMentor = await document.save()
            return savedMentor
        } catch (error: unknown) {
            throw error
        }
    }

    async mentorGoogleLogin(email: string): Promise<IMentor | null> {
        try {
            const logMentor = await MentorModel.findOne({ email })
            return logMentor
        } catch (error: unknown) {
            throw error
        }
    }

    async mentorForgetPassword(email: string, password: string): Promise<IMentor | null> {
        try {
            const findMentor = await MentorModel.findOne({ email })
            if (!findMentor) {
                const error = new Error("Mentor Not Found")
                error.name = "MentorNotFound"
                throw error
            }
            findMentor.password = password
            await findMentor.save()
            return findMentor
        } catch (error: unknown) {
            throw error
        }
    }

    async mentorProfileUpdate(userId: string, userData: MentorProfileUpdateInput): Promise<IMentor | null> {
        try {
            const mentorData: any = {
                username: userData.username,
                phone: userData.phone,
            }
            if (userData.profilePicUrl) {
                mentorData.profilePicUrl = userData.profilePicUrl
            }
            const updatedProfile = await MentorModel.findByIdAndUpdate(
                userId,
                mentorData,
                { new: true }
            )
            return updatedProfile
        } catch (error: unknown) {
            throw error
        }
    }

    async mentorCheck(userId: string): Promise<IMentor | null> {
        try {
            const checkMentor = await MentorModel.findById(userId)
            return checkMentor
        } catch (error: unknown) {
            throw error
        }
    }

    async mentorVerify(email: string): Promise<IMentor | null> {
        try {
            const findUser = await MentorModel.findOne({ email }) as IMentor
            findUser.isVerified = true
            const verifiyedUser = await findUser.save()
            return verifiyedUser
        } catch (error: unknown) {
            throw error
        }
    }

    async mentorReVerify(email: string): Promise<IMentor | null> {
        try {
            const findUser = await MentorModel.findOne({ email }) as IMentor
            findUser.isVerified = true
            const verifiyedUser = await findUser.save()
            return verifiyedUser
        } catch (error: unknown) {
            throw error
        }
    }


    //////////////////////// WEEK - 2 ////////////////////////////////////

    async mentorAddCourse(data: any): Promise<ICourse | null> {
        try {
            const findCategory = await CategoryModel.findOne(
                { categoryName: data.category }
            ) as unknown as ICategory

            data.categoryId = findCategory?._id

            const isExist = await CourseModel.findOne({ courseName: data.courseName })

            if (isExist) {
                const error = new Error('Already Exist')
                error.name = 'AlreadyExist'
                throw error
            }

            const response = await CourseModel.create(data);
            return response
        } catch (error: unknown) {
            throw error
        }
    }

    async mentorGetAllCourse(userId: string, page: number, limit: number): Promise<mentorGetALlCourseOuput | null> {
        try {
            const skip = (page - 1) * limit;

            const response = await CourseModel
                .find({ mentorId: userId })
                .skip(skip)
                .limit(limit)
                .sort({ createdAt: -1 });

            const totalCourses = await CourseModel.countDocuments();

            if (!response || response.length === 0) {
                const error = new Error('Courses Not Found');
                error.name = 'CoursesNotFound';
                throw error;
            }

            return {
                courses: response,
                currentPage: page,
                totalPages: Math.ceil(totalCourses / limit),
                totalCourses: totalCourses
            };
        } catch (error: unknown) {
            throw error
        }
    }

    async mentorGetCourse(courseId: string): Promise<ICourse | null> {
        try {
            const getCourse = await CourseModel.findById(courseId)
            return getCourse
        } catch (error: unknown) {
            throw error
        }
    }

    async mentorEditCourse(courseId: string, updatingData: MentorEditCourseInput): Promise<ICourse | null> {
        try {
            const isExist = await CourseModel.findOne({
                courseName: updatingData.courseName,
                _id: { $ne: courseId }
            })

            if (isExist) {
                const error = new Error('Already Exist')
                error.name = 'AlreadyExist'
                throw error
            }

            const response = await CourseModel.findByIdAndUpdate(
                courseId,
                updatingData,
                { new: true }
            )
            return response

        } catch (error: unknown) {
            throw error
        }
    }

    async mentorUnPulishCourse(courseId: string): Promise<ICourse | null> {
        try {
            const unPublish = await CourseModel.findByIdAndUpdate(
                courseId,
                { isPublished: false },
                { new: true }
            )
            return unPublish
        } catch (error: unknown) {
            throw error
        }
    }

    async mentorPublishCourse(courseId: string): Promise<ICourse | null> {
        try {
            const publish = await CourseModel.findByIdAndUpdate(
                courseId,
                { isPublished: true },
                { new: true }
            )
            return publish
        } catch (error: unknown) {
            throw error
        }
    }

    async mentorFilterCourse(page: number, limit: number, searchTerm: string): Promise<mentorFilterCourse | null> {
        try {
            const skip = (page - 1) * limit;

            const query: any = {};
            if (searchTerm !== 'undefined') {
                query.courseName = { $regex: searchTerm, $options: 'i' };
            }

            const courses = await CourseModel.find(query).skip(skip).limit(limit).sort({ createdAt: -1 })

            const totalCourses = await CourseModel.countDocuments(query);

            if (!courses || courses.length === 0) {
                const error = new Error('Course Not Found')
                error.name = 'CourseNotFound'
                throw error
            }
            return {
                courses,
                currentPage: page,
                totalPages: Math.ceil(totalCourses / limit),
                totalCourses,
            };

        } catch (error: unknown) {
            throw error
        }
    }

    async mentorGetAllCategorise(): Promise<ICategory[] | null> {
        try {
            const getAllCategories = await CategoryModel.find()
            return getAllCategories
        } catch (error: unknown) {
            throw error
        }
    }

    async mentorAddChapter(data: MentorAddChapterInput): Promise<IChapter | null> {
        try {
            const newDocument = new ChapterModel(data)
            const savedChapter = await newDocument.save()
            await CourseModel.findByIdAndUpdate(
                data.courseId,
                {
                    $push: {
                        fullVideo: { chapterId: savedChapter._id },
                    },
                },
                { new: true }
            );
            return savedChapter
        } catch (error: unknown) {
            throw error
        }
    }

    async mentorEditChapter(data: MentorEditChapterInput): Promise<IChapter | null> {
        try {
            const datas: any = {
                chapterTitle: data.title,
                description: data.description,
            }

            if (data.fileLocation) {
                datas.videoUrl = data.fileLocation
            }

            const updatedChapter = await ChapterModel.findByIdAndUpdate(
                data.chapterId,
                { $set: datas },
                { new: true }
            );

            return updatedChapter

        } catch (error: unknown) {
            throw error
        }
    }

    async mentorGetAllChapters(courseId: string): Promise<IChapter[] | null> {
        try {
            const getChapters = await ChapterModel.find({ courseId })
            return getChapters
        } catch (error: unknown) {
            throw error
        }
    }

    async mentorAddQuizz(data: MentorAddQuizInput, courseId: string): Promise<IQuiz | null> {
        try {
            const findQuizz = await QuizModel.findOne({ courseId: courseId }) as IQuiz;

            const questionData = {
                question: data.question,
                options: [data.option1, data.option2],
                correct_answer: data.correctAnswer,
            };

            const questionExist = findQuizz?.questions.some(q => q.question === data.question);
            if (questionExist) {
                const error = new Error('Question Already Exist')
                error.name = 'QuestionAlreadyExist'
                throw error
            }

            if (findQuizz) {
                findQuizz.questions.push(questionData);
                await findQuizz.save();
                return findQuizz;
            }
            const newQuizz = await QuizModel.create({ courseId: courseId, questions: [questionData] });
            return newQuizz;


        } catch (error: unknown) {
            throw error
        }
    }

    async mentorGetAllQuizz(courseId: string): Promise<IQuiz[] | null> {
        try {
            const getAllQuizz = await QuizModel.find({ courseId })
            return getAllQuizz
        } catch (error: unknown) {
            throw error
        }
    }

    async mentorDeleteQuizz(courseId: string, quizzId: string): Promise<IQuiz | null> {
        try {
            const findQuizz = await QuizModel.findOne({ courseId }) as IQuiz;
            const objectIdQuizId = new mongoose.Types.ObjectId(quizzId);

            findQuizz.questions = findQuizz.questions.filter((question: any) =>
                !question._id.equals(objectIdQuizId)
            );

            const updatedQuizz = await findQuizz.save();
            return updatedQuizz;
        } catch (error: unknown) {
            throw error
        }
    }

    async mentorGetWallet(userId: string, page: number, limit: number): Promise<mentorWalletOutput | null> {
        try {
            const skip = (page - 1) * limit;

            const response = await MentorWalletModel
                .find({ mentorId: userId })
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .select("-__v"); // Exclude the `__v` field if unnecessary

            // Count total wallet documents for the mentor
            const totalWallets = await MentorWalletModel.countDocuments({ mentorId: userId });

            return {
                wallets: response, // Renamed to `wallets` for better readability
                currentPage: page,
                totalPages: Math.ceil(totalWallets / limit),
                totalWallets,
            };
           
        } catch (error: unknown) {
            throw error
        }
    }


    ////////////////////////// WEEK - 3 //////////////////////////////////////////

    async mentorChatGetRooms(mentorId: string): Promise<MentorChatGetRoomsOutput | null> {
        try {
            const getRooms = await ChatRoomsModel
                .find({ mentorId })
                .populate({
                    path: 'studentId',
                    select: 'username profilePicUrl'
                })
                .populate({
                    path: 'mentorId',
                    select: 'username'
                })
            const formatted = await Promise.all(
                getRooms.map(async (data: any) => {
                    // Find the corresponding room for the mentor
                    const getRoom = await ChatRoomsModel.findOne({ studentId: data.studentId });
                    return {
                        lastMessage: getRoom?.lastMessage,
                        studentData: data.studentId,
                        mentorData: data.mentorId,
                    };
                })
            );
            return formatted
        } catch (error: unknown) {
            throw error
        }
    }

    async mentorCreateRoom(studentId: string, mentorId: string): Promise<IChatRooms | null> {
        try {
            const existRoom = await ChatRoomsModel.findOne({ studentId, mentorId }) as unknown as IChatRooms
            if (existRoom) {
                return existRoom
            }
            const roomData = {
                studentId,
                mentorId
            }
            const newRoom = new ChatRoomsModel(roomData)
            const createdRoom = await newRoom.save()
            return createdRoom
        } catch (error: unknown) {
            throw error
        }
    }

    async mentorGetMessages(roomId: string): Promise<IMessages[] | null> {
        try {
            const message = await MessageModel.find({ roomId }) as unknown as IMessages[]
            if (message?.length === 0) {
                const error = new Error('Messages Not Found')
                error.name = "MessageNotFound"
                throw error
            }
            return message
        } catch (error: unknown) {
            throw error
        }
    }

    async mentorSaveMessage(message: string, roomId: string, receiverId: string, senderId: string): Promise<IMessages | null> {
        try {
            console.log('save repo')
            const lastMessage = await ChatRoomsModel.findById(roomId) as IChatRooms
            lastMessage.lastMessage = message
            await lastMessage.save()
            console.log('last message saved')

            const newMessage = new MessageModel({
                senderId: senderId,
                receiverId: receiverId,
                roomId: roomId,
                message: message,
                senderModel: 'Mentors',
                receiverModel: 'User'
            });

            const savedMessage = await newMessage.save();
            console.log('message saved ', savedMessage)
            return savedMessage
        } catch (error: unknown) {
            throw error
        }
    }
}