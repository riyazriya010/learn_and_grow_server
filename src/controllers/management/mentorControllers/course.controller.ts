import getId from "../../../integration/getId";
import MentorCourseServices from "../../../services/business/mentorServices/course.services";
import { mentorCourseServices } from "../../../services/business/mentorServices/course.services";
import { ErrorResponse, SuccessResponse } from "../../../utils/responseUtil";
import { Request, Response } from "express";

export default class MentorCourseController {
     private mentorCourseServices: MentorCourseServices

     constructor(mentorCourseServices: MentorCourseServices){
        this.mentorCourseServices = mentorCourseServices
     }

     async mentorAddCourse(req: Request, res: Response): Promise<void> {
        try {
            console.log('req.body addcourse ', req.body)

            // Map demo videos
            const demoVideo = [{
                type: 'video',
                url: req.body.demoVideoUrl,
            }]

            const mentorId = await getId('accessToken', req)

            // Append processed fields to request body
            req.body.demoVideo = demoVideo;
            req.body.mentorId = String(mentorId)


            const data = req.body

            const addCourse = await this.mentorCourseServices.mentorAddCourse(data)

            SuccessResponse(res, 200, "Course Added Successfully", addCourse)



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

            const getAllCourse = await this.mentorCourseServices.mentorGetAllCourse(String(userId), pageNumber, limitNumber)

            SuccessResponse(res, 200, "All Courses Got It", getAllCourse)
            return
        } catch (error: unknown) {
            if(error instanceof Error){
                if(error.name === 'CoursesNotFound'){
                    ErrorResponse(res, 404, 'Courses Not Found')
            return
                }
            }
            ErrorResponse(res, 500, 'Internal Server Error')
            return
        }
    }

    async mentorGetCourse(req: Request, res: Response): Promise<void> {
        try {
            const { courseId } = req.query
            const mentorId = await getId('accessToken', req) as string
            const getCourse = await this.mentorCourseServices.mentorGetCourse(String(courseId), mentorId)
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

            const editedCourse = await this.mentorCourseServices.mentorEditCourse(String(courseId), updatedFields)

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
            const unPublish = await this.mentorCourseServices.mentorUnPulishCourse(String(courseId))
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
            const publish = await this.mentorCourseServices.mentorPublishCourse(String(courseId))
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

            const mentorId = await getId('accessToke',req) as string

            const filterCourse = await this.mentorCourseServices.mentorFilterCourse(pageNumber, limitNumber, String(searchTerm), mentorId)
            SuccessResponse(res, 200, "Filtered Course", filterCourse)
            return
        } catch (error: unknown) {
            if (error instanceof Error) {
                if (error.name === 'CourseNotFound') {
                    ErrorResponse(res, 404, "Course Not Found")
                    return
                }
            }
            ErrorResponse(res, 500, 'Internal Server Error')
            return
        }
    }

    async mentorGetAllCategorise(req: Request, res: Response): Promise<void> {
        try {
            const getAllCategories = await this.mentorCourseServices.mentorGetAllCategorise()
            SuccessResponse(res, 200, "Categories Got It", getAllCategories)
            return;
        } catch (error: unknown) {
            ErrorResponse(res, 500, 'Internal Server Error')
            return
        }
    }

}

export const mentorCourseController = new MentorCourseController(mentorCourseServices)


