import { IAdminCourseMethods } from "../../../interface/admin/admin.interface";
import { AdminWalletModel, IAdminWallet } from "../../../models/adminWallet.model";
import { ChapterModel, IChapter } from "../../../models/chapter.model";
import { CourseModel, ICourse } from "../../../models/uploadCourse.model";
import CommonBaseRepository from "../../baseRepositories/commonBaseRepository";




export default class AdminCourseRepository extends CommonBaseRepository<{
    Course: ICourse
    AdminWallet: IAdminWallet
    Chapter: IChapter
}> implements IAdminCourseMethods {

    constructor() {
        super({
            Course: CourseModel,
            AdminWallet: AdminWalletModel,
            Chapter: ChapterModel
        })
    }

    async adminGetAllCourse(page: number = 1, limit: number = 5): Promise<any> {
        try {
            const skip = (page - 1) * limit;

            const response = await this.findAll('Course', { isPublished: true })
                .skip(skip)
                .limit(limit)
                .sort({ createdAt: -1 });

            const totalCourses = await this.findAll('Course').countDocuments();

            if (!response || response.length === 0) {
                const error = new Error('Course Not Found');
                error.name = 'CoursesNotFound';
                throw error;
            }

            return {
                courses: response,
                currentPage: page,
                totalPages: Math.ceil(totalCourses / limit),
                totalCourses: totalCourses
            };
        } catch (error: any) {
            throw error
        }
    }


    async adminUnListCourse(courseId: string): Promise<any> {
        try {
            const updatedCourse = await this.updateById('Course',
                courseId,
                { isListed: false }
            )

            const getAllCourse = await this.findAll('Course')

            return getAllCourse

        } catch (error: any) {
            throw error
        }
    }


    async adminListCourse(courseId: string): Promise<any> {
        try {
            const updatedCourse = await this.updateById('Course',
                courseId,
                { isListed: true },
            )
            const getAllCourse = await this.findAll('Course')
            return getAllCourse
        } catch (error: any) {
            throw error
        }
    }

    async adminNonApprovedCourse(pageNumber: number, limitNumber: number): Promise<any> {
        try {

            const skip = (pageNumber - 1) * limitNumber;

            const getCourses = await this.findAll('Course',{ approved: false })
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limitNumber)
                .exec();

            const totalCourses = await this.findAll('Course',{ approved: false }).countDocuments();

            return {
                courses: getCourses,
                currentPage: pageNumber,
                totalPages: Math.ceil(totalCourses / limitNumber),
                totalCourses: totalCourses,
            }
        } catch (error: any) {
            throw error
        }
    }

    async adminNonApprovedCourseDetails(courseId: string): Promise<any> {
        try {
            const checkApprove = await this.findById('Course',courseId) as ICourse
            if (checkApprove.approved) {
                return []
            }
            const getChapters = await this.findAll('Chapter',{ courseId }).exec()
            return getChapters
        } catch (error: any) {
            throw error
        }
    }

    async adminApproveCourse(courseId: string): Promise<any> {
        try {
            const approveCourse = await this.updateById('Course',
                courseId,
                { approved: true }
            );
            return approveCourse
        } catch (error: any) {
            throw error
        }
    }



    async adminGetWallet(adminId: string, pageNumber: number = 1, limitNumber: number = 4): Promise<any> {
        try {
            const skip = (pageNumber - 1) * limitNumber;

            const response = await this.findAll('AdminWallet', { adminId })
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limitNumber)
                .select("-__v");

            const totalWallets = await this.findAll('AdminWallet', { adminId }).countDocuments();

            return {
                wallets: response, // Renamed to `wallets` for better readability
                currentPage: pageNumber,
                totalPages: Math.ceil(totalWallets / limitNumber),
                totalWallets,
            };
        } catch (error: any) {
            // Improved error handling with additional debug info
            console.error("Error in getWallet:", error.message);
            throw error;
        }
    }

}