import { IStudentMethods } from "../../interface/students/student.interface";
import { StudentBuyCourseInput, StudentChatGetUsersOutput, studentCompleteCourse, StudentCourseFilterData, StudentCoursePlay, StudentCreateCreatificateData, studentFilterCoursesOuput, studentGetAllCoursesOuput, studentGetBuyedCourses, StudentGetCourseOuput, StudentGetCoursePlayOutput, StudentGoogleSignupInput, StudentProfileInput, StudentSignUpInput } from "../../interface/students/student.types";
import { CertificateModel, ICertificate } from "../../models/certificate.model";
import { ChapterModel, IChapter } from "../../models/chapter.model";
import { ChatRoomsModel, IChatRooms } from "../../models/chatRooms.model";
import { IMessages, MessageModel } from "../../models/messages.model";
import { IPurchasedCourse, PurchasedCourseModel } from "../../models/purchased.model";
import QuizModel, { IQuiz } from "../../models/quizz.model";
import { BagdetModel } from "../../models/studentBadges.model";
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
                transactionId: txnid,
                completedChapters,
                isCourseCompleted: false,
                price: amount
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
                .limit(limitNumber)
                .populate("courseId", "courseName level")
                .exec();

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
            const badgeName = 'completion Badge'
            const findBadge = await BagdetModel.findOne({badgeName})
            const createBadge = new BagdetModel({
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
            const getCertificates = await CertificateModel.find({ userId: studentId }).sort({issuedDate: -1})
            return getCertificates
        } catch (error: unknown) {
            throw error
        }
    }


    ////////////////////////////////// WEEK - 3 //////////////////////////////////
    async studentChatGetUsers(studentId: string): Promise<StudentChatGetUsersOutput | null> {
        try {
            const getUsers = await PurchasedCourseModel
                .find({ userId: studentId })
                // .populate({
                //     path: "userId",
                //     select: "_id username profilePicUrl"
                // })
                .populate({
                    path: "mentorId",
                    select: "_id username profilePicUrl"
                });
                
            const formatted = await Promise.all(
                getUsers.map(async (data: any) => {
                    // Find the corresponding room for the mentor
                    const getRoom = await ChatRoomsModel.findOne({ studentId: data.userId });
                    return {
                        lastMessage: getRoom?.lastMessage,
                        userData: data.userId,
                        mentorData: data.mentorId,
                    };
                })
            );
            return formatted
        } catch (error: unknown) {
            throw error
        }
    }

    async studentCreateRoom(studentId: string, mentorId: string): Promise<IChatRooms | null> {
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

    async studentGetMessages(roomId: string): Promise<IMessages[] | null> {
        try {
            
            const messages = await MessageModel.find({ roomId }) as unknown as IMessages[]
            console.log('message: ',messages)
            if (messages.length === 0) {
                return []; // Return empty array if no messages found
            }
            return messages
        } catch (error: unknown) {
            throw error
        }
    }

    async studentSaveMessage(message: string, roomId: string, receiverId: string, senderId: string): Promise<IMessages | null> {
        try {
            const lastMessage = await ChatRoomsModel.findById(roomId) as IChatRooms
            lastMessage.lastMessage = message
            await lastMessage.save()
            
            const newMessage = new MessageModel({
                senderId: senderId,        // or mentorId
                receiverId: receiverId,  // userId or mentorId
                roomId: roomId,
                message: message,
                senderModel: 'User',     // or 'Mentor' based on who is sending the message
                receiverModel: 'Mentors'  // or 'User' based on who is receiving the message
            });

            const savedMessage = await newMessage.save();
            return savedMessage
        } catch (error: unknown) {
            throw error
        }
    }
}