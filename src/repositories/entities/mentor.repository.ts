import mongoose, { Types } from "mongoose";
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
import UserModel, { IUser } from "../../models/user.model";
import { MentorNotificationModel } from "../../models/mentorNotification.model";

// import { startOfDay, endOfDay, subMonths, subYears, startOfMonth, endOfMonth, startOfYear, endOfYear } from 'date-fns';
import { subDays, subMonths, subYears, startOfDay, endOfDay } from 'date-fns';
import { PurchasedCourseModel } from "../../models/purchased.model";

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

    async mentorChatGetStudents(mentorId: string): Promise<any> {
        try {
            const getUsers = await ChatRoomsModel.find({ mentorId })
                .populate({
                    path: "studentId",
                    select: "_id username profilePicUrl"
                });

            const uniqueStudents = new Set<string>();
            const formatted: { studentData: any; updatedAt: Date }[] = [];

            for (const data of getUsers) {
                const student = data.studentId as unknown as IUser;
                if (student && !uniqueStudents.has(student._id.toString())) {
                    uniqueStudents.add(student._id.toString());

                    // Fetch the chat room for this student and mentor
                    const getRoom = await ChatRoomsModel.findOne({
                        mentorId,
                        studentId: student._id,
                    });

                    // Add student data with lastMessage and updatedAt
                    formatted.push({
                        studentData: {
                            ...student.toObject(),
                            lastMessage: getRoom?.lastMessage || null,
                            mentorMsgCount: getRoom?.mentorMsgCount || 0,
                        },
                        updatedAt: getRoom?.updatedAt || new Date(0), // Default to old date if no chat exists
                    });
                }
            }
            formatted.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());

            return formatted
        } catch (error: unknown) {
            throw error
        }
    }

    async mentorGetMessages(studentId: string, mentorId: string): Promise<any> {
        try {
            const findRoom = await ChatRoomsModel.findOne({ studentId, mentorId }) as unknown as IChatRooms
            const roomId = findRoom._id
            const findMessages = await MessageModel.find({ roomId })
            return findMessages
        } catch (error: unknown) {
            throw error
        }
    }

    async mentorSaveMessage(studentId: string, mentorId: string, message: string): Promise<any> {
        try {
            const findRoom = await ChatRoomsModel.findOne({ studentId, mentorId }) as IChatRooms
            findRoom.lastMessage = message
            findRoom.userMsgCount += 1
            await findRoom.save()

            const data: any = {
                senderId: mentorId,
                receiverId: studentId,
                roomId: findRoom?._id,
                message: message,
                senderModel: "Mentors",
                receiverModel: "User"
            }
            const newMessage = new MessageModel(data)
            const savedMessage = await newMessage.save()

            return savedMessage
        } catch (error: unknown) {
            throw error
        }
    }

    async mentorCreateRoom(studentId: string, mentorId: string): Promise<any> {
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

    async mentorDeleteEveryOne(messageId: string): Promise<any> {
        try {
            const findMessage = await MessageModel.findById(messageId) as unknown as IMessages
            findMessage.deletedForSender = true
            findMessage.deletedForReceiver = true
            await findMessage.save()
            // Update chat room's last message if necessary
            const chatRoom = await ChatRoomsModel.findOne({ _id: findMessage.roomId });

            if (chatRoom) {
                const remainingMessages = await MessageModel.find({ roomId: chatRoom._id });
                const validMessages = remainingMessages.filter(msg => !msg.deletedForSender && !msg.deletedForReceiver);

                if (validMessages.length > 0) {
                    const lastMessage = validMessages[validMessages.length - 1];
                    chatRoom.lastMessage = lastMessage.message;
                } else {
                    chatRoom.lastMessage = '';
                }

                await chatRoom.save();
            }
            return findMessage
        } catch (error: unknown) {
            throw error
        }
    }

    async mentorDeleteForMe(messageId: string): Promise<any> {
        try {
            const findMessage = await MessageModel.findById(messageId) as unknown as IMessages
            findMessage.deletedForSender = true
            await findMessage.save()
            // Check if this is the last message sent by the sender, and update chat room's last message
            const chatRoom = await ChatRoomsModel.findOne({ _id: findMessage.roomId });

            if (chatRoom) {
                const remainingMessages = await MessageModel.find({ roomId: chatRoom._id });
                const validMessages = remainingMessages.filter(msg => !msg.deletedForSender);

                if (validMessages.length > 0) {
                    const lastMessage = validMessages[validMessages.length - 1];
                    chatRoom.lastMessage = lastMessage.message;
                } else {
                    chatRoom.lastMessage = '';
                }

                await chatRoom.save();
            }
            return findMessage
        } catch (error: unknown) {
            throw error
        }
    }

    async mentorResetCount(studentId: string, mentorId: string): Promise<any> {
        try {
            const findRoom = await ChatRoomsModel.findOne({ studentId, mentorId }) as unknown as IChatRooms
            findRoom.mentorMsgCount = 0
            await findRoom.save()

            //find messages
            const findMessages = await MessageModel.find({ roomId: findRoom.id })
            return findMessages
        } catch (error: unknown) {
            throw error
        }
    }



    //Notificaions
    async mentorCreateNotification(username: string, senderId: string, receiverId: string): Promise<any> {
        try {
            const data = {
                senderId,
                receiverId,
                senderName: username
            }
            const createNotification = new MentorNotificationModel(data)
            await createNotification.save()
            return createNotification
        } catch (error: unknown) {
            throw error
        }
    }

    async mentorGetNotificationsCount(mentorId: string): Promise<any> {
        try {
            const getNotification = await MentorNotificationModel.find({ receiverId: mentorId, seen: false }).countDocuments()
            return { count: getNotification }
        } catch (error: unknown) {
            throw error
        }
    }

    async mentorGetNotifications(mentorId: string): Promise<any> {
        try {
            const allNotifications = await MentorNotificationModel
                .find({ receiverId: mentorId })
                .sort({ createdAt: -1 });

            // Remove duplicate senderId notifications (keeping only the most recent)
            const seenSenders = new Set();
            const uniqueNotifications = allNotifications.filter(notification => {
                if (!seenSenders.has(notification.senderId.toString())) {
                    seenSenders.add(notification.senderId.toString());
                    return true;
                }
                return false;
            });
            return uniqueNotifications
        } catch (error: unknown) {
            throw error
        }
    }

    async mentorGetNotificationsSeen(): Promise<any> {
        try {
            const markSeen = await MentorNotificationModel.updateMany(
                { seen: false },
                { $set: { seen: true } }
            );
            return markSeen
        } catch (error: unknown) {
            throw error
        }
    }

    async mentorDeleteNotifications(senderId: string): Promise<any> {
        try {
            const deleteMessage = await MentorNotificationModel.deleteMany({ senderId })
            return deleteMessage
        } catch (error: unknown) {
            throw error
        }
    }

    async mentorGetStudent(studentId: string, mentorId: string): Promise<any> {
        try {
            const findMentor = await UserModel.findById(studentId).select("_id username profilePicUrl");

            const getRoom = await ChatRoomsModel.findOne({
                studentId,
                mentorId,
            });

            return {
                ...findMentor?.toObject(),
                lastMessage: getRoom?.lastMessage || null,
                userMsgCount: getRoom?.userMsgCount || 0,
            }

        } catch (error: unknown) {
            throw error
        }
    }


    //////////////////////////////////// WEEK - 4 ////////////////////////////

    async mentorDashboard(mentorId: string): Promise<any> {
        try {
            const mentorObjectId = new Types.ObjectId(mentorId);

            const todayStart = startOfDay(new Date());
            const todayEnd = endOfDay(new Date());

            // Get yesterday's date
            const yesterday = subDays(new Date(), 1);

            // Last 30 days till yesterday
            const prevMonthStart = startOfDay(subDays(yesterday, 29));
            const prevMonthEnd = endOfDay(yesterday);

            // Last 365 days till yesterday
            const prevYearStart = startOfDay(subDays(yesterday, 364));
            const prevYearEnd = endOfDay(yesterday);

            // Last 6 months
            const sixMonthsStart = startOfDay(subMonths(new Date(), 5));

            // 📌 1️⃣ Revenue Stats
            const revenueStats = await PurchasedCourseModel.aggregate([
                {
                    $match: {
                        mentorId: mentorObjectId,
                        purchasedAt: { $exists: true }
                    }
                },
                {
                    $group: {
                        _id: "$purchasedAt",
                        totalRevenue: { $sum: "$price" }
                    }
                },
                {
                    $group: {
                        _id: null,
                        todayRevenue: {
                            $sum: {
                                $cond: [
                                    { $and: [{ $gte: ["$_id", todayStart] }, { $lte: ["$_id", todayEnd] }] },
                                    "$totalRevenue",
                                    0
                                ]
                            }
                        },
                        prevMonthRevenue: {
                            $sum: {
                                $cond: [
                                    { $and: [{ $gte: ["$_id", prevMonthStart] }, { $lte: ["$_id", prevMonthEnd] }] },
                                    "$totalRevenue",
                                    0
                                ]
                            }
                        },
                        prevYearRevenue: {
                            $sum: {
                                $cond: [
                                    { $and: [{ $gte: ["$_id", prevYearStart] }, { $lte: ["$_id", prevYearEnd] }] },
                                    "$totalRevenue",
                                    0
                                ]
                            }
                        },
                        totalRevenue: { $sum: "$totalRevenue" }
                    }
                }
            ]);


            // 📌 2️⃣ Course Performance Stats
            const courses = await CourseModel.find({ mentorId: mentorObjectId });
            const totalCourses = courses.length;

            const mostEnrolledCourse = await PurchasedCourseModel.aggregate([
                { $match: { mentorId: mentorObjectId } },
                { $group: { _id: "$courseId", enrollments: { $sum: 1 } } },
                { $sort: { enrollments: -1 } },
                { $limit: 1 },
                {
                    $lookup: {
                        from: "courses",
                        localField: "_id",
                        foreignField: "_id",
                        as: "courseDetails",
                    },
                },
                { $unwind: "$courseDetails" },
                {
                    $project: {
                        _id: 1,
                        enrollments: 1,
                        courseName: "$courseDetails.courseName",
                    },
                },
            ]);

            const leastEnrolledCourse = await PurchasedCourseModel.aggregate([
                { $match: { mentorId: mentorObjectId } },
                { $group: { _id: "$courseId", enrollments: { $sum: 1 } } },
                { $sort: { enrollments: 1 } },
                { $limit: 1 },
                {
                    $lookup: {
                        from: "courses",
                        localField: "_id",
                        foreignField: "_id",
                        as: "courseDetails",
                    },
                },
                { $unwind: "$courseDetails" },
                {
                    $project: {
                        _id: 1,
                        enrollments: 1,
                        courseName: "$courseDetails.courseName",
                    },
                },
            ]);

            // 📌 3️⃣ Student Engagement Stats
            const totalStudents = await PurchasedCourseModel.countDocuments({ mentorId: mentorObjectId });

            const activeStudents = await PurchasedCourseModel.countDocuments({
                mentorId: mentorObjectId,
                "completedChapters.completedAt": { $gte: subMonths(new Date(), 1) }
            });

            const totalCompletedCourses = await PurchasedCourseModel.countDocuments({
                mentorId: mentorObjectId,
                isCourseCompleted: true
            });

            const courseCompletionRate = totalStudents > 0 ? Math.floor((totalCompletedCourses / totalStudents) * 100) : 0;

            // 📌 4️⃣ Sales & Revenue Trends (Last 6 Months)
            const salesTrends = await PurchasedCourseModel.aggregate([
                {
                    $match: {
                        mentorId: mentorObjectId,
                        purchasedAt: { $gte: sixMonthsStart }
                    }
                },
                {
                    $group: {
                        _id: { $month: "$purchasedAt" },
                        salesCount: { $sum: 1 },
                        revenue: { $sum: "$price" }
                    }
                },
                { $sort: { "_id": 1 } }
            ]);

            // 📌 5️⃣ Top Performing Courses
            const topCourses = await PurchasedCourseModel.aggregate([
                { $match: { mentorId: mentorObjectId } },
                { $group: { _id: "$courseId", revenue: { $sum: "$price" }, enrollments: { $sum: 1 } } },
                { $sort: { revenue: -1 } },
                { $limit: 5 }
            ]);

            return {
                // Revenue Overview
                todayRevenue: revenueStats[0]?.todayRevenue || 0,
                prevMonthRevenue: revenueStats[0]?.prevMonthRevenue || 0,
                prevYearRevenue: revenueStats[0]?.prevYearRevenue || 0,
                totalRevenue: revenueStats[0]?.totalRevenue || 0,

                // Course Performance
                totalCourses,
                mostEnrolledCourse: mostEnrolledCourse.length ? mostEnrolledCourse[0] : "N/A",
                leastEnrolledCourse: leastEnrolledCourse.length ? leastEnrolledCourse[0] : "N/A",

                // Student Engagement
                totalStudents,
                activeStudents,
                courseCompletionRate,

                // Sales Trends
                salesTrends,

                // Top Performing Courses
                topCourses
            }
        } catch (error: unknown) {
            throw error
        }
    }

    async mentorChartGraph(mentorId: string, filters: any): Promise<any> {
        try {
            console.log('chart mentorId: ', mentorId)
            const mentorIdObject = new Types.ObjectId(mentorId);
            const { year, month, date } = filters;

            const currentYear = new Date().getFullYear();
            const currentMonth = new Date().getMonth() + 1;

            const filterYear = year ? parseInt(year as string) : currentYear;

            // Default empty arrays for courseSales and revenueOrders
            let courseSales = [];
            let revenueOrders = [];

            // If the date is provided, filter for the specific date
            if (date) {
                const specificDate = new Date(date as string);
                const startOfDay = new Date(specificDate.setHours(0, 0, 0, 0));
                const endOfDay = new Date(specificDate.setHours(23, 59, 59, 999));

                courseSales = await PurchasedCourseModel.aggregate([
                    {
                        $match: {
                            mentorId: mentorIdObject,
                            purchasedAt: { $gte: startOfDay, $lt: endOfDay },
                        }
                    },
                    {
                        $group: {
                            _id: "$courseId",
                            totalSales: { $sum: 1 }
                        }
                    },
                    {
                        $lookup: {
                            from: "courses",
                            localField: "_id",
                            foreignField: "_id",
                            as: "courseDetails"
                        }
                    },
                    { $unwind: "$courseDetails" },
                    {
                        $project: {
                            _id: 0,
                            courseName: "$courseDetails.courseName",
                            totalSales: 1
                        }
                    }
                ]);

                let totalPurchases = courseSales.reduce((sum, course) => sum + course.totalSales, 0);
                courseSales = courseSales.map(course => ({
                    courseName: course.courseName,
                    percentage: totalPurchases > 0 ? ((course.totalSales / totalPurchases) * 100).toFixed(2) : "0.00"
                }));

                if (courseSales.length === 0) {
                    courseSales = [{ courseName: "No sales data", percentage: "0.00" }];
                }

                revenueOrders = await PurchasedCourseModel.aggregate([
                    {
                        $match: {
                            mentorId: mentorIdObject,
                            purchasedAt: { $gte: startOfDay, $lt: endOfDay },
                        }
                    },
                    {
                        $group: {
                            _id: null,
                            totalRevenue: { $sum: "$price" },
                            totalOrders: { $sum: 1 }
                        }
                    },
                    {
                        $project: {
                            totalRevenue: 1,
                            totalOrders: 1,
                            _id: 0
                        }
                    }
                ]);
            }
            // If year and month are provided, filter by year and month
            else if (month) {
                const monthIndex = new Date(`${month} 1, 2022`).getMonth() + 1;
                const startOfMonth = new Date(`${filterYear}-${String(monthIndex).padStart(2, '0')}-01`);
                const endOfMonth = new Date(startOfMonth);
                endOfMonth.setMonth(endOfMonth.getMonth() + 1);

                courseSales = await PurchasedCourseModel.aggregate([
                    {
                        $match: {
                            mentorId: mentorIdObject,
                            purchasedAt: { $gte: startOfMonth, $lt: endOfMonth },
                        }
                    },
                    {
                        $group: {
                            _id: "$courseId",
                            totalSales: { $sum: 1 }
                        }
                    },
                    {
                        $lookup: {
                            from: "courses",
                            localField: "_id",
                            foreignField: "_id",
                            as: "courseDetails"
                        }
                    },
                    { $unwind: "$courseDetails" },
                    {
                        $project: {
                            _id: 0,
                            courseName: "$courseDetails.courseName",
                            totalSales: 1
                        }
                    }
                ]);

                let totalPurchases = courseSales.reduce((sum, course) => sum + course.totalSales, 0);
                courseSales = courseSales.map(course => ({
                    courseName: course.courseName,
                    percentage: totalPurchases > 0 ? ((course.totalSales / totalPurchases) * 100).toFixed(2) : "0.00"
                }));

                if (courseSales.length === 0) {
                    courseSales = [{ courseName: "No sales data", percentage: "0.00" }];
                }

                revenueOrders = await PurchasedCourseModel.aggregate([
                    {
                        $match: {
                            mentorId: mentorIdObject,
                            purchasedAt: { $gte: startOfMonth, $lt: endOfMonth },
                        }
                    },
                    {
                        $group: {
                            _id: null,
                            totalRevenue: { $sum: "$price" },
                            totalOrders: { $sum: 1 }
                        }
                    },
                    {
                        $project: {
                            totalRevenue: 1,
                            totalOrders: 1,
                            _id: 0
                        }
                    }
                ]);

            }
            // If only the year is provided, fetch data for the whole year
            else {
                courseSales = await PurchasedCourseModel.aggregate([
                    {
                        $match: {
                            mentorId: mentorIdObject,
                            purchasedAt: {
                                $gte: new Date(`${filterYear}-01-01`),
                                $lt: new Date(`${filterYear + 1}-01-01`),
                            }
                        }
                    },
                    {
                        $group: {
                            _id: "$courseId",
                            totalSales: { $sum: 1 }
                        }
                    },
                    {
                        $lookup: {
                            from: "courses",
                            localField: "_id",
                            foreignField: "_id",
                            as: "courseDetails"
                        }
                    },
                    { $unwind: "$courseDetails" },
                    {
                        $project: {
                            _id: 0,
                            courseName: "$courseDetails.courseName",
                            totalSales: 1
                        }
                    }
                ]);

                let totalPurchases = courseSales.reduce((sum, course) => sum + course.totalSales, 0);
                courseSales = courseSales.map(course => ({
                    courseName: course.courseName,
                    percentage: totalPurchases > 0 ? ((course.totalSales / totalPurchases) * 100).toFixed(2) : "0.00"
                }));

                if (courseSales.length === 0) {
                    courseSales = [{ courseName: "No sales data", percentage: "0.00" }];
                }

                revenueOrders = await PurchasedCourseModel.aggregate([
                    {
                        $match: {
                            mentorId: mentorIdObject,
                            purchasedAt: {
                                $gte: new Date(`${filterYear}-01-01`),
                                $lt: new Date(`${filterYear + 1}-01-01`),
                            }
                        }
                    },
                    {
                        $group: {
                            _id: { $month: "$purchasedAt" },
                            totalRevenue: { $sum: "$price" },
                            totalOrders: { $sum: 1 }
                        }
                    },
                    {
                        $sort: { _id: 1 }
                    },
                    {
                        $project: {
                            month: "$_id",
                            totalRevenue: 1,
                            totalOrders: 1,
                            _id: 0
                        }
                    }
                ]);
            }

            return {
                year: filterYear,
                courseSales: courseSales,
                revenueOrders: revenueOrders
            }
        } catch (error: unknown) {
            throw error
        }
    }

    async mentorSalesReport(mentorId: string, filters: any): Promise<any> {
        try {
            console.log('report mentorId', mentorId)
            const mentorIdObject = new Types.ObjectId(mentorId);
            console.log('obj id ',mentorIdObject)
            const { year, month, date } = filters;

            const currentYear = new Date().getFullYear();
            const filterYear = year ? parseInt(year as string) : currentYear;

            let report = [];
            let salesCount = 0;
            let dateFilter = {};

            if (date) {
                const startOfDay = new Date(date.startDate);
                startOfDay.setHours(0, 0, 0, 0);

                const endOfDay = new Date(date.endDate);
                endOfDay.setHours(23, 59, 59, 999);

                dateFilter = { purchasedAt: { $gte: startOfDay, $lt: endOfDay } };
            } else if (month) {
                const monthIndex = new Date(`${month} 1, 2022`).getMonth() + 1;
                const startOfMonth = new Date(`${filterYear}-${String(monthIndex).padStart(2, '0')}-01`);
                const endOfMonth = new Date(startOfMonth);
                endOfMonth.setMonth(endOfMonth.getMonth() + 1);

                dateFilter = { purchasedAt: { $gte: startOfMonth, $lt: endOfMonth } };
            } else {
                dateFilter = { purchasedAt: { $gte: new Date(`${filterYear}-01-01`), $lt: new Date(`${filterYear + 1}-01-01`) } };
            }

            report = await PurchasedCourseModel.aggregate([
                {
                    $match: {
                        mentorId: mentorIdObject,
                        ...dateFilter
                    }
                },
                {
                    $lookup: {
                        from: "users",
                        localField: "userId",
                        foreignField: "_id",
                        as: "userDetails"
                    }
                },
                {
                    $lookup: {
                        from: "courses",
                        localField: "courseId",
                        foreignField: "_id",
                        as: "courseDetails"
                    }
                },
                {
                    $unwind: "$userDetails"
                },
                {
                    $unwind: "$courseDetails"
                },
                {
                    $project: {
                        _id: 0,
                        username: "$userDetails.username",
                        coursename: "$courseDetails.courseName",
                        price: 1,
                        purchasedAt: 1,
                        transactionId: 1
                    }
                }
            ]);

            salesCount = report.length;
            console.log('report ', report)
            return {
                report: report,
                salesCount: salesCount
            }
        } catch (error: unknown) {
            throw error
        }
    }
    
}