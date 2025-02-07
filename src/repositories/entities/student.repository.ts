import { IStudentMethods } from "../../interface/students/student.interface";
import { StudentBuyCourseInput, StudentChatGetUsersOutput, studentCompleteCourse, StudentCourseFilterData, StudentCoursePlay, StudentCreateCreatificateData, studentFilterCoursesOuput, studentGetAllCoursesOuput, studentGetBuyedCourses, StudentGetCourseOuput, StudentGetCoursePlayOutput, StudentGoogleSignupInput, StudentProfileInput, StudentSignUpInput } from "../../interface/students/student.types";
import { BadgeManagementModel } from "../../models/adminBadge.model";
import { CertificateModel, ICertificate } from "../../models/certificate.model";
import { ChapterModel, IChapter } from "../../models/chapter.model";
import { ChatRoomsModel, IChatRooms } from "../../models/chatRooms.model";
import MentorModel, { IMentor } from "../../models/mentor.model";
import { IMessages, MessageModel } from "../../models/messages.model";
import { IPurchasedCourse, PurchasedCourseModel } from "../../models/purchased.model";
import QuizModel, { IQuiz } from "../../models/quizz.model";
import { BadgeModel, IBadge } from "../../models/studentBadges.model";
import { IStudentNotification, StudentNotificationModel } from "../../models/studentNotification.model";
import { CourseModel, ICourse } from "../../models/uploadCourse.model";
import UserModel, { IUser } from "../../models/user.model";

// here we can access the data base
export default class StudentRepository implements IStudentMethods {

    //////////////////////// WEEK - 1 ////////////////////////////////////

    async studentLogin(email: string, password: string): Promise<IUser | null> {
        try {
            const findUser = await UserModel.findOne({ email: email })
            return findUser
        } catch (error: unknown) {
            if (error instanceof Error) {
                throw error
            }
            throw error
        }
    }

    async studentSignUp(userData: StudentSignUpInput): Promise<IUser | null> {
        try {
            const existUser = await UserModel.findOne({ email: userData.email })
            if (existUser) {
                const error = new Error('User Already Exist')
                error.name = 'UserExist'
                throw error
            }

            const { username, email, phone, password } = userData;
            const modifiedUser = {
                username,
                email,
                phone,
                password,
                role: 'student',
                studiedHours: 0,
            };
            const newUser = new UserModel(modifiedUser)
            await newUser.save()
            return newUser

        } catch (error: unknown) {
            if (error instanceof Error) {
                throw error
            }
            throw error
        }
    }

    async studentGoogleSignUp(userData: StudentGoogleSignupInput): Promise<IUser | null> {
        try {
            const existUser = await UserModel.findOne({ email: userData?.email })
            if (existUser) {
                const error = new Error('User Already Exist')
                error.name = 'UserExist'
                throw error
            }
            const modifiedUser = {
                username: userData.displayName,
                email: userData.email,
                phone: 'Not Provided',
                studiedHours: 0,
                password: 'null',
                role: 'student',
                isVerified: true
            }

            const newUesr = new UserModel(modifiedUser)
            await newUesr.save()

            return newUesr
        } catch (error: unknown) {
            if (error instanceof Error) {
                throw error
            }
            throw error
        }
    }

    async studentGoogleLogin(email: string): Promise<IUser | null> {
        try {
            const findUser = await UserModel.findOne({ email: email })
            if (!findUser) {
                const error = new Error('User Not Found')
                error.name = 'UserNotFound'
                throw error
            }
            return findUser
        } catch (error: unknown) {
            throw error
        }
    }

    async studentForgetPassword(email: string, password: string): Promise<void> {
        try {
            const findUser = await UserModel.findOne({ email: email })
            console.log('find ', findUser)
            if (!findUser) {
                const error = new Error('User Not Found')
                error.name = 'UserNotFound'
                throw error
            }
            findUser.password = password
            await findUser.save()
            return
        } catch (error: unknown) {
            throw error
        }
    }

    async studentVerify(email: string): Promise<IUser | null> {
        try {
            const findUser = await UserModel.findOne({ email: email })
            if (!findUser) {
                const error = new Error('User Not Found')
                error.name = 'UserNotFound'
                throw error
            }
            findUser.isVerified = true
            await findUser.save()
            return findUser
        } catch (error: unknown) {
            throw error
        }
    }

    async studentProfleUpdate(studentId: string, userData: StudentProfileInput): Promise<IUser | null> {
        try {
            const updateData: any = {
                username: userData.username,
                phone: userData.phone
            }
            if (userData.profilePicUrl) {
                updateData.profilePicUrl = userData.profilePicUrl
            }
            const updatedUser = await UserModel.findByIdAndUpdate(
                studentId,
                updateData,
                { new: true }
            )
            return updatedUser
        } catch (error: unknown) {
            throw error
        }
    }

    async studentReVerify(email: string): Promise<IUser | null> {
        try {
            const findUser = await UserModel.findOne({ email: email })
            if (!findUser) {
                const error = new Error('User Not Found')
                error.name = 'UserNotFound'
                throw error
            }
            return findUser
        } catch (error: unknown) {
            throw error
        }
    }

    async studentCheck(studentId: string): Promise<IUser | null> {
        try {
            const findUser = await UserModel.findById(studentId)
            return findUser
        } catch (error: unknown) {
            throw error
        }
    }



    ////////////////////////////// WEEK - 2 //////////////////////////////

    async studentGetCourse(courseId: string, studentId: string): Promise<StudentGetCourseOuput | null> {
        try {
            const getCourse = await CourseModel
                .findById(courseId)
                .populate({
                    path: 'fullVideo.chapterId',
                    model: 'Chapter',
                    select: 'chapterTitle description',
                }) as ICourse

            const chaptersData = getCourse?.fullVideo?.map((video: any) => video.chapterId);

            if (studentId !== '') {
                const AlreadPurchased = await PurchasedCourseModel.findOne(
                    { userId: studentId, courseId: getCourse?._id }
                )
                if (AlreadPurchased) {
                    return {
                        course: getCourse,
                        alreadyBuyed: 'Already Buyed',
                        chapters: chaptersData
                    }
                }
            }
            return {
                course: getCourse,
                chapters: chaptersData
            }

        } catch (error: unknown) {
            throw error
        }
    }

    async studentGetAllCourses(pageNumber: number, limitNumber: number): Promise<studentGetAllCoursesOuput | null> {
        try {
            const skip = (pageNumber - 1) * limitNumber;

            const getAllCourse = await CourseModel
                .find({ isPublished: true, isListed: true })
                .skip(skip)
                .limit(limitNumber)
                .sort({ createdAt: -1 })

            const totalCourses = await CourseModel.countDocuments();

            if (!getAllCourse || getAllCourse.length === 0) {
                const error = new Error('Courses Not Found');
                error.name = 'CoursesNotFound';
                throw error;
            }

            return {
                courses: getAllCourse,
                currentPage: pageNumber,
                totalPages: Math.ceil(totalCourses / limitNumber),
                totalCourses: totalCourses
            };

        } catch (error: unknown) {
            throw error
        }
    }

    async studentCourseFilterData(filterData: StudentCourseFilterData): Promise<studentFilterCoursesOuput | null> {
        try {
            const { pageNumber, limitNumber, selectedCategory, selectedLevel, searchTerm } = filterData
            const skip = (pageNumber - 1) * limitNumber;

            // Base query with isPublished and isListed checks
            const query: any = {
                isPublished: true,
                isListed: true,
            };

            if (selectedCategory !== 'undefined') {
                query.category = { $regex: `^${selectedCategory}$`, $options: 'i' };
            }
            if (selectedLevel !== 'undefined') {
                query.level = { $regex: `^${selectedLevel}$`, $options: 'i' };
            }
            if (searchTerm !== 'undefined') {
                console.log('search: ', searchTerm);
                query.courseName = { $regex: searchTerm, $options: 'i' };
            }

            const filteredCourse = await CourseModel
                .find(query)
                .populate({
                    path: 'categoryId', // Reference to the Category model
                    match: { isListed: true }, // Ensure the category is listed
                    select: 'isListed categoryName', // Select relevant fields from the Category model
                })
                .skip(skip)
                .limit(limitNumber)
                .sort({ createdAt: -1 })

            // Filter courses to exclude those with unlisted categories
            const filteredCourses = filteredCourse.filter((course: any) => course.categoryId);

            const totalCourses = filteredCourses.length;

            if (filteredCourses.length === 0) {
                const error = new Error('Course Not Found');
                error.name = 'CourseNotFound';
                throw error;
            }

            return {
                courses: filteredCourses,
                currentPage: pageNumber,
                totalPages: Math.ceil(totalCourses / limitNumber),
                totalCourses,
            };

        } catch (error: unknown) {
            throw error
        }
    }

    async studentGetCoursePlay(courseId: string): Promise<StudentGetCoursePlayOutput> {
        try {
            const findCourse = await CourseModel
                .findById(courseId)
                .populate("fullVideo.chapterId")

            if (!findCourse) {
                const error = new Error('Courses Not Found')
                error.name = 'CoursesNotFound'
                throw error
            }

            const courseData = findCourse as unknown as ICourse
            const chapters = courseData?.fullVideo?.map((video: any) => video?.chapterId) || []

            return {
                course: findCourse,
                chapters
            }

        } catch (error: unknown) {
            throw error
        }
    }

    async studentBuyCourse(purchaseData: StudentBuyCourseInput): Promise<IPurchasedCourse> {
        try {
            const { userId, courseId, txnid, amount } = purchaseData

            const course = await CourseModel.findById(courseId)
            const mentorId = course?.mentorId

            const findChapters = await ChapterModel.find({ courseId: courseId })

            if (findChapters.length === 0) {
                const error = new Error('Chapters Not Found')
                error.name = "Chapters Not Found"
                throw error
            }

            const completedChapters = findChapters.map((chapter: any) => ({
                chapterId: chapter._id,
                isCompleted: false,
            }));

            const purchasedCourse = {
                userId,
                courseId,
                mentorId,
                transactionId: txnid,
                completedChapters,
                isCourseCompleted: false,
                price: Number(amount)
            }

            const document = new PurchasedCourseModel(purchasedCourse)
            const savedUser = await document.save()

            return savedUser

        } catch (error: unknown) {
            throw error
        }
    }

    async studentBuyedCourses(studentId: string, pageNumber: number, limitNumber: number): Promise<studentGetBuyedCourses | null> {
        try {
            const skip = (pageNumber - 1) * limitNumber;
            const getCourses = await PurchasedCourseModel
                .find({ userId: studentId })
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(4)
                .populate("courseId", "courseName level")
                .exec()

            const totalCourses = await PurchasedCourseModel.countDocuments({ userId: studentId });


            return {
                courses: getCourses,
                currentPage: pageNumber,
                totalPages: Math.ceil(totalCourses / limitNumber),
                totalCourses: totalCourses,
            };

        } catch (error: unknown) {
            throw error
        }
    }


    async studentCoursePlay(purchaseId: string): Promise<StudentCoursePlay> {
        try {
            const purchasedCourse = await PurchasedCourseModel
                .findById(purchaseId)
                .populate({
                    path: 'courseId',
                    select: 'courseName duration level description category thumbnailUrl',
                    populate: {
                        path: 'fullVideo.chapterId',
                        model: 'Chapter',
                        select: 'chapterTitle courseId chapterNumber description videoUrl createdAt',
                    },
                })
                .exec() as unknown as IPurchasedCourse

            const courseData = purchasedCourse.courseId as unknown as ICourse
            const chaptersData = courseData?.fullVideo?.map((video: any) => video.chapterId);

            return {
                purchasedCourse,
                course: {
                    courseName: courseData?.courseName,
                    duration: courseData?.duration,
                    level: courseData?.level,
                    description: courseData?.description,
                    category: courseData?.category,
                    thumbnailUrl: courseData?.thumbnailUrl,
                },
                chapters: chaptersData,
            };

        } catch (error: unknown) {
            throw error
        }
    }

    async studentChapterVideoEnd(chapterId: string): Promise<IPurchasedCourse> {
        try {
            console.log('id: ', chapterId)
            const findChapter = await PurchasedCourseModel.findOne({
                "completedChapters.chapterId": chapterId
            }) as unknown as IPurchasedCourse
            console.log('found chap ', findChapter)
            const chapterIndex = findChapter.completedChapters.findIndex((chapter) => chapter.chapterId.toString() === chapterId);

            findChapter.completedChapters[chapterIndex].isCompleted = true

            const updatedChapters = await findChapter.save()
            console.log('upd ', updatedChapters)
            return updatedChapters

        } catch (error: unknown) {
            throw error
        }
    }

    async studentGeCerfiticate(certificateId: string): Promise<ICertificate> {
        try {
            const findCertificate = await CertificateModel.findById(certificateId)
            return findCertificate as unknown as ICertificate
        } catch (error: unknown) {
            throw error
        }
    }

    async studentCompleteCourse(userId: string, courseId: string): Promise<studentCompleteCourse> {
        try {
            const completeCourse = await PurchasedCourseModel.findOne({ userId, courseId })
                .populate({
                    path: 'courseId',
                    select: 'courseName',
                    populate: {
                        path: 'mentorId',
                        model: 'Mentors',
                        select: 'username'
                    }
                })
                .exec() as unknown as IPurchasedCourse;

            if (completeCourse.isCourseCompleted) {
                const error = new Error('Course Already Completed')
                error.name = "CourseAlreadyCompleted"
                throw error
            }

            completeCourse.isCourseCompleted = true;

            const courseData = completeCourse.courseId as unknown as ICourse

            const updatedCourse = await completeCourse.save();

            const mentor = (courseData?.mentorId as unknown as { username: string }) || { username: null };


            return {
                updatedCourse,
                courseName: courseData?.courseName,
                mentorName: mentor.username,
            }

        } catch (error: unknown) {
            throw error
        }
    }

    async studentQuizz(courseId: string): Promise<IQuiz> {
        try {
            const getQuizz = await QuizModel.findOne({ courseId })
            return getQuizz as unknown as IQuiz
        } catch (error: unknown) {
            throw error
        }
    }

    async studentCreateCertificate(certificateData: StudentCreateCreatificateData): Promise<ICertificate> {
        try {
            const { studentId, studentName, courseName, mentorName, courseId } = certificateData;

            const certificate = new CertificateModel({
                userId: studentId,
                userName: studentName,
                courseName,
                mentorName,
                courseId,
            });

            const savedCertificate = await certificate.save();

            //creating badge for student
            const findBadge = await BadgeManagementModel.findOne({ badgeName: 'Completion Badge' })
            const createBadge = new BadgeModel({
                userId: studentId,
                badgeId: findBadge?._id
            })
            await createBadge.save()

            return savedCertificate;
        } catch (error: unknown) {
            throw error
        }
    }

    async studentGetAllCertificates(studentId: string): Promise<ICertificate[]> {
        try {
            const getCertificates = await CertificateModel.find({ userId: studentId }).sort({ issuedDate: -1 })
            return getCertificates
        } catch (error: unknown) {
            throw error
        }
    }


    ////////////////////////////////// WEEK - 3 //////////////////////////////////

    async studentChatGetMentors(studentId: string): Promise<any> {
        try {
            const getUsers = await PurchasedCourseModel.find({ userId: studentId })
                .populate({
                    path: "mentorId",
                    select: "_id username profilePicUrl"
                });

            const uniqueMentors = new Set<string>();
            const formatted: { mentorsData: any; updatedAt: Date }[] = [];

            for (const data of getUsers) {
                const mentor = data.mentorId as unknown as IMentor;
                if (mentor && !uniqueMentors.has(mentor._id.toString())) {
                    uniqueMentors.add(mentor._id.toString());

                    const getRoom = await ChatRoomsModel.findOne({
                        studentId,
                        mentorId: mentor._id,
                    });

                    formatted.push({
                        mentorsData: {
                            ...mentor.toObject(),
                            lastMessage: getRoom?.lastMessage || null,
                            userMsgCount: getRoom?.userMsgCount || 0,
                            updatedAt: getRoom?.updatedAt || new Date(0),
                        },
                        updatedAt: getRoom?.updatedAt || new Date(0),
                    });
                }
            }
            formatted.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());

            return formatted
        } catch (error: unknown) {
            throw error
        }
    }

    async studentCreateRoom(studentId: string, mentorId: string): Promise<any> {
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

    async studentSaveMessage(studentId: string, mentorId: string, message: string): Promise<IMessages | null> {
        try {
            const findRoom = await ChatRoomsModel.findOne({ studentId, mentorId }) as IChatRooms
            findRoom.lastMessage = message
            findRoom.mentorMsgCount += 1
            await findRoom.save()

            const data: any = {
                senderId: studentId,
                receiverId: mentorId,
                roomId: findRoom?._id,
                message: message,
                senderModel: "User",
                receiverModel: "Mentors"
            }
            const newMessage = new MessageModel(data)
            const savedMessage = await newMessage.save()
            return savedMessage
        } catch (error: unknown) {
            throw error
        }
    }

    async studentGetMessages(studentId: string, mentorId: string): Promise<any> {
        try {
            const findRoom = await ChatRoomsModel.findOne({ studentId, mentorId }) as unknown as IChatRooms
            const roomId = findRoom._id
            const findMessages = await MessageModel.find({ roomId })
            return findMessages
        } catch (error: unknown) {
            throw error
        }
    }

    async studentDeleteEveryOne(messageId: string): Promise<any> {
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

    async studentDeleteForMe(messageId: string): Promise<any> {
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
                    chatRoom.lastMessage = '';  // No valid messages left
                }

                await chatRoom.save();
            }
            return findMessage
        } catch (error: unknown) {
            throw error
        }
    }

    async studentResetCount(studentId: string, mentorId: string): Promise<any> {
        try {
            const findRoom = await ChatRoomsModel.findOne({ studentId, mentorId }) as unknown as IChatRooms
            findRoom.userMsgCount = 0
            await findRoom.save()

            //find messages
            const findMessages = await MessageModel.find({ roomId: findRoom.id })
            return findMessages
        } catch (error: unknown) {
            throw error
        }
    }

    ///// Notification
    async studentCreateNotification(username: string, senderId: string, receiverId: string): Promise<any> {
        try {
            const data = {
                senderId,
                receiverId,
                senderName: username
            }
            const createNotification = new StudentNotificationModel(data)
            await createNotification.save()
            console.log('created noti')
        } catch (error: unknown) {
            throw error
        }
    }

    async studentGetNotifications(studentId: string): Promise<any> {
        try {
            // Fetch notifications sorted by createdAt (newest first)
            const allNotifications = await StudentNotificationModel
                .find({ receiverId: studentId })
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

    async studentGetNotificationsCount(studentId: string): Promise<any> {
        try {
            const getNotification = await StudentNotificationModel.find({ receiverId: studentId, seen: false }).countDocuments()
            return { count: getNotification }
        } catch (error: unknown) {
            throw error
        }
    }

    async studentGetNotificationsSeen(): Promise<any> {
        try {
            const markSeen = await StudentNotificationModel.updateMany(
                { seen: false },
                { $set: { seen: true } }
            );
            return markSeen
        } catch (error: unknown) {
            throw error
        }
    }

    async studentDeleteNotifications(senderId: string): Promise<any> {
        try {
            const deleteMessage = await StudentNotificationModel.deleteMany({ senderId })
            return deleteMessage
        } catch (error: unknown) {
            throw error
        }
    }

    async studentGetMentor(studentId: string, mentorId: string): Promise<any> {
        try {
            const findMentor = await MentorModel.findById(mentorId).select("_id username profilePicUrl");

            // Fetch the chat room for this student and mentor
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

    async studentGetBadges(studentId: string): Promise<IBadge[] | null> {
        try {
            const findBadges = await BadgeModel.find({ userId: studentId })
                .populate({
                    path: "badgeId",
                    select: "badgeName description value"
                })
                .sort({ createdAt: -1 });

            return findBadges;
        } catch (error: unknown) {
            throw error
        }
    }


}