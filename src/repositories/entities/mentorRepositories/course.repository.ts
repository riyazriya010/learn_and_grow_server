import mongoose from "mongoose";
import { IMentorCourseMethods } from "../../../interface/mentors/mentor.interface";
import { CategoryModel, ICategory } from "../../../models/categroy.model";
import { CourseModel, ICourse } from "../../../models/uploadCourse.model";
import MentorCourseBaseRepository from "../../baseRepositories/mentorBaseRepositories/courseBaseRepository";
import { MentorEditCourseInput, mentorFilterCourse, mentorGetALlCourseOuput } from "../../../interface/mentors/mentor.types";
import CommonBaseRepository from "../../baseRepositories/commonBaseRepository";



export default class MentorCourseRepository extends CommonBaseRepository<{
    Category: ICategory;
    Course: ICourse;
}> implements IMentorCourseMethods {

    constructor() {
        super({
            Category: CategoryModel,
            Course: CourseModel
        })
    }


    async mentorAddCourse(data: any): Promise<ICourse | null> {
        try {
            const findCategory = await this.findOne('Category',
                { categoryName: data.category }
            ) as unknown as ICategory

            const mentorId = new mongoose.Types.ObjectId(String(data?.mentorId))
            data.mentorId = mentorId
            data.categoryId = new mongoose.Types.ObjectId(String(findCategory?._id))

            const isExist = await this.findOne('Course', { courseName: data.courseName })

            if (isExist) {
                const error = new Error('Already Exist')
                error.name = 'AlreadyExist'
                throw error
            }

            const response = await this.createData('Course', data as unknown as Partial<ICourse>);
            return response
        } catch (error: unknown) {
            throw error
        }
    }

    async mentorGetAllCourse(userId: string, page: number, limit: number): Promise<mentorGetALlCourseOuput | null> {
        try {
            const skip = (page - 1) * limit;

            const response = await this.findAll('Course', { mentorId: userId })
                .skip(skip)
                .limit(limit)
                .sort({ createdAt: -1 });

            const totalCourses = await this.findAll('Course').countDocuments();

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

    async mentorGetCourse(courseId: string, mentorId: string): Promise<ICourse | null> {
        try {
            // const getCourse = await this.findById('Course', courseId)
            const getCourse = await this.findOne('Course', {_id: courseId, mentorId})

            if (!getCourse) {
                // Return default values if no course found
                return {
                    _id: '',
                    courseName: '',
                    mentorId: '',
                    categoryId: '',
                    description: '',
                    demoVideo: [],
                    price: 0,
                    category: '',
                    level: '',
                    duration: '',
                    thumbnailUrl: '',
                    approved: false,
                    isPublished: false,
                    isListed: false,
                    fullVideo: [],
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    __v: 0
                } as unknown as ICourse; // Ensure the return type is ICourse
            }

            return getCourse
        } catch (error: unknown) {
            throw error
        }
    }

    async mentorEditCourse(courseId: string, updatingData: MentorEditCourseInput): Promise<ICourse | null> {
        try {
            const isExist = await this.findOne('Course', {
                courseName: updatingData.courseName,
                _id: { $ne: courseId }
            })

            if (isExist) {
                const error = new Error('Already Exist')
                error.name = 'AlreadyExist'
                throw error
            }

            const response = await this.updateById('Course',
                courseId,
                updatingData
            )
            return response

        } catch (error: unknown) {
            throw error
        }
    }

    async mentorUnPulishCourse(courseId: string): Promise<ICourse | null> {
        try {
            const unPublish = await this.updateById('Course',
                courseId,
                { isPublished: false },
            )
            return unPublish
        } catch (error: unknown) {
            throw error
        }
    }

    async mentorPublishCourse(courseId: string): Promise<ICourse | null> {
        try {
            const publish = await this.updateById('Course',
                courseId,
                { isPublished: true }
            )
            return publish
        } catch (error: unknown) {
            throw error
        }
    }

    async mentorFilterCourse(page: number, limit: number, searchTerm: string, mentorId: string): Promise<mentorFilterCourse | null> {
        try {
            const skip = (page - 1) * limit;

            const query: any = { mentorId }
            if (searchTerm !== 'undefined') {
                query.courseName = { $regex: searchTerm, $options: 'i' };
            }

            const courses = await this.findAll('Course', query).skip(skip).limit(limit).sort({ createdAt: -1 })

            const totalCourses = await this.findAll('Course', query).countDocuments();

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
            const getAllCategories = await this.findAll('Category')
            return getAllCategories
        } catch (error: unknown) {
            throw error
        }
    }

}