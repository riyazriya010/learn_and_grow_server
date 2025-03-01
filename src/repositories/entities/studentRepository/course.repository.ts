import { IStudentCourseMethods } from "../../../interface/students/student.interface";
import { IPurchasedCourse, PurchasedCourseModel } from "../../../models/purchased.model";
import { ICourse, CourseModel } from "../../../models/uploadCourse.model";
import { StudentBuyCourseInput, studentCompleteCourse, StudentCourseFilterData, StudentCoursePlay, studentFilterCoursesOuput, studentGetAllCoursesOuput, studentGetBuyedCourses, StudentGetCourseOuput, StudentGetCoursePlayOutput } from "../../../interface/students/student.types";
import { ChapterModel, IChapter } from "../../../models/chapter.model";
import mongoose from "mongoose";
import { IMentorWallet, MentorWalletModel } from "../../../models/mentorWallet.model";
import { AdminWalletModel, IAdminWallet } from "../../../models/adminWallet.model";
import QuizModel, { IQuiz } from "../../../models/quizz.model";
import CommonBaseRepository from "../../baseRepositories/commonBaseRepository";

export default class StudentCourseRepository extends CommonBaseRepository<{
    PurchasedCourse: IPurchasedCourse;
    Course: ICourse;
    Chapter: IChapter;
    MentorWallet: IMentorWallet;
    AdminWallet: IAdminWallet;
    Quiz: IQuiz
}> implements IStudentCourseMethods {

    constructor() {
        super({
            PurchasedCourse: PurchasedCourseModel,
            Course: CourseModel,
            Chapter: ChapterModel,
            MentorWallet: MentorWalletModel,
            AdminWallet: AdminWalletModel,
            Quiz: QuizModel
        });
    }

    async studentGetAllCourses(pageNumber: number, limitNumber: number): Promise<studentGetAllCoursesOuput | null> {
        try {
            const skip = (pageNumber - 1) * limitNumber;

            // Get the Query object first (no `await` yet)
            const getAllCourse = await this.findAll("Course", { isPublished: true, isListed: true, approved: true })
                .populate({
                    path: 'categoryId', // Reference to the Category model
                    match: { isListed: true }, // Ensure the category is listed
                    select: 'isListed categoryName', // Select relevant fields from the Category model
                })
                .skip(skip)
                .limit(limitNumber)
                .sort({ createdAt: - 1 })
                .exec();
            console.log('getAll  ', getAllCourse)
            console.log('getAll lenth ', getAllCourse.length)

            // Count total courses
            const query = await this.findAll('Course', { isPublished: true, isListed: true, approved: true })
                .populate({
                    path: 'categoryId', // Reference to the Category model
                    match: { isListed: true }, // Ensure the category is listed
                    select: 'isListed categoryName', // Select relevant fields from the Category model
                })

            // console.log('query ', query)

            const filteredCourses = getAllCourse.filter((course: any) => course?.categoryId?.isListed)
            const courses = query?.filter((course: any) => course?.categoryId?.isListed)
            const totalCourses = courses.length

            // Count documents
            // const totalCourses = await query.clone().countDocuments();
            // const totalCourses = await this.models.Course.countDocuments({ isPublished: true, isListed: true, approved: true });

            if (!getAllCourse || getAllCourse.length === 0) {
                throw new Error("Courses Not Found");
            }

            return {
                courses: filteredCourses,
                currentPage: pageNumber,
                totalPages: Math.ceil(totalCourses / limitNumber),
                totalCourses: totalCourses
            };
        } catch (error: unknown) {
            throw error;
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
                approved: true
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

            console.log('query ', query)

            const filteredCourse = await this.findAll("Course", query)
                .populate({
                    path: 'categoryId', // Reference to the Category model
                    match: { isListed: true }, // Ensure the category is listed
                    select: 'isListed categoryName', // Select relevant fields from the Category model
                })
                .skip(skip)
                .limit(limitNumber)
                .sort({ createdAt: -1 })

            console.log('filteredCouse: ', filteredCourse)

            // Filter courses to exclude those with unlisted categories
            const filteredCourses = filteredCourse.filter((course: any) => course?.categoryId?.isListed);

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

    async studentGetCourse(courseId: string, studentId: string): Promise<StudentGetCourseOuput | null> {
        try {
            console.log('courseId: ', courseId)
            console.log('studentId: ', studentId)

            const getCourse = await this.findById('Course', courseId)
                .populate({
                    path: 'fullVideo.chapterId',
                    model: 'Chapter',
                    select: 'chapterTitle description',
                }) as ICourse

            console.log('getCourse: ', getCourse)

            const chaptersData = getCourse?.fullVideo?.map((video: any) => video.chapterId);

            if (studentId !== '') {
                const AlreadPurchased = await this.findOne('PurchasedCourse', { userId: studentId, courseId: getCourse?._id })
                if (AlreadPurchased) {
                    return {
                        course: getCourse,
                        alreadyBuyed: 'Already Buyed',
                        chapters: chaptersData
                    }
                }
            }
            console.log('entered')
            return {
                course: getCourse,
                chapters: chaptersData
            }

        } catch (error: unknown) {
            throw error
        }
    }

    async studentGetCoursePlay(courseId: string, studentId: string): Promise<StudentGetCoursePlayOutput | null> {
        try {
            const isCourse = await this.findOne('PurchasedCourse', { courseId, userId: studentId })
            if (!isCourse) {
                const error = new Error('Courses Not Found')
                error.name = 'CoursesNotFound'
                throw error
            }
            const findCourse = await this.findById('Course', courseId)
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
            console.log('enter 1')
            const course = await this.findById('Course', courseId)
            const mentorId = course?.mentorId

            const findChapters = await this.findAll('Chapter', { courseId: courseId })

            if (findChapters.length === 0) {
                const error = new Error('Chapters Not Found')
                error.name = "Chapters Not Found"
                throw error
            }

            console.log('enter 2')

            const completedChapters = findChapters.map((chapter: any) => ({
                chapterId: chapter._id,
                isCompleted: false,
            }));

            // const purchasedCourse = {
            //     userId,
            //     courseId,
            //     mentorId,
            //     transactionId: txnid,
            //     completedChapters,
            //     isCourseCompleted: false,
            //     price: Number(amount)
            // }

            const purchasedCourse = {
                userId: new mongoose.Types.ObjectId(userId), // ✅ Correct
                courseId: new mongoose.Types.ObjectId(courseId), // ✅ Correct
                mentorId: mentorId ? new mongoose.Types.ObjectId(String(mentorId)) : undefined,// Convert if not undefined
                transactionId: String(txnid),
                completedChapters,
                isCourseCompleted: false,
                price: Number(amount),
            };

            const createdCourse = await this.createData('PurchasedCourse', purchasedCourse as unknown as Partial<IPurchasedCourse>)
            console.log('createdCourse : ', createdCourse)

            //Mentor Payment And Admin Commission for Purchase To their Wallet
            // const courseName = course?.courseName as string

            // Calculate the 90% for mentor and 10% for admin
            // const mentorAmount = (Number(amount) * 90) / 100;
            // const adminCommission = (Number(amount) * 10) / 100;

            // const mentorWallet = await this.findById('MentorWallet', String(mentorId));

            // if (mentorWallet) {
            //     mentorWallet.balance += Number(mentorAmount);
            //     mentorWallet.transactions.push({
            //         type: "credit",
            //         amount: Number(mentorAmount),
            //         date: new Date(),
            //         courseName,
            //         adminCommission: `${adminCommission.toFixed(2)} (10%)`,
            //     });
            //     await mentorWallet.save();
            // } else {
            //     // Create a new wallet if it doesn't exist
            //     await MentorWalletModel.create({
            //         mentorId,
            //         balance: Number(mentorAmount),
            //         transactions: [
            //             {
            //                 type: "credit",
            //                 amount: Number(mentorAmount),
            //                 date: new Date(),
            //                 courseName,
            //                 adminCommission: `${adminCommission.toFixed(2)} (10%)`,
            //             },
            //         ],
            //     });
            // }

            // // Add 10% to admin's wallet
            // const adminWallet = await this.findById('AdminWallet', "admin");

            // if (adminWallet) {
            //     adminWallet.balance += Number(adminCommission);
            //     adminWallet.transactions.push({
            //         type: "credit",
            //         amount: Number(adminCommission),
            //         date: new Date(),
            //         courseName,
            //     });
            //     await adminWallet.save();
            // } else {
            //     // Create a new wallet if it doesn't exist
            //     await AdminWalletModel.create({
            //         adminId: "admin",
            //         balance: Number(adminCommission),
            //         transactions: [
            //             {
            //                 type: "credit",
            //                 amount: Number(adminCommission),
            //                 date: new Date(),
            //                 courseName,
            //             },
            //         ],
            //     });
            // }

            return createdCourse

        } catch (error: unknown) {
            throw error
        }
    }

    async studentBuyedCourses(studentId: string, pageNumber: number, limitNumber: number): Promise<studentGetBuyedCourses | null> {
        try {
            const skip = (pageNumber - 1) * limitNumber;
            const getCourses = await this.findAll('PurchasedCourse', { userId: studentId })
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(4)
                .populate("courseId", "courseName level")
                .exec()

            const findCourses = await this.findAll('PurchasedCourse', { userId: studentId });
            const totalCourses = findCourses.length


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

    async studentCoursePlay(purchaseId: string, studentId: string): Promise<StudentCoursePlay> {
        try {
            // const purchasedCourse = await this.findById('PurchasedCourse', purchaseId)
            const purchasedCourse = await this.findOne('PurchasedCourse', { _id: purchaseId, userId: studentId })
                .populate({
                    path: 'courseId',
                    select: 'courseName duration level description category thumbnailUrl',
                    populate: {
                        path: 'fullVideo.chapterId',
                        model: 'Chapter',
                        select: 'chapterTitle courseId chapterNumber description videoUrl createdAt',
                    },
                })
                .exec() as unknown as IPurchasedCourse | null

            if (!purchasedCourse) {
                return {
                    purchasedCourse: {} as IPurchasedCourse,
                    course: {
                        courseName: '',
                        duration: '',
                        level: '',
                        description: '',
                        category: '',
                        thumbnailUrl: '',
                    },
                    chapters: [],
                };
            }

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

    async studentChapterVideoEnd(chapterId: string, studiedTime: string, studentId: string): Promise<IPurchasedCourse> {
        try {
            console.log('chapterId ', chapterId)
            const findChapter = await this.findOne('PurchasedCourse', {
                userId: studentId,
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

    async studentCompleteCourse(studentId: string, courseId: string): Promise<studentCompleteCourse> {
        try {
            const completeCourse = await this.findOne('PurchasedCourse', { userId: studentId, courseId })
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

    async studentQuizz(courseId: string, studentId: string): Promise<IQuiz | any> {
        try {
            const isPurchased = await this.findOne('PurchasedCourse', { courseId, userId: studentId })
            if (!isPurchased) {
                return {
                    _id: '',
                    courseId: '',
                    questions: [],
                } as unknown as IQuiz;
            }
            const getQuizz = await this.findOne('Quiz', { courseId })
            return getQuizz as unknown as IQuiz
        } catch (error: unknown) {
            throw error
        }
    }

    async studentCheckAlreadyBuyed(courseId: string, studentId: string): Promise<IPurchasedCourse | null> {
        try {
            const purchasedCourse = await this.findOne('PurchasedCourse', {
                courseId,
                userId: studentId,
            });

            if (!purchasedCourse) {
                return null;
            }

            return purchasedCourse as unknown as IPurchasedCourse;
        } catch (error: unknown) {
            throw error
        }
    }

}

