import getId from "../../../integration/getId";
import StudentCourseServices, { courseServices } from "../../../services/business/studentServices/course.services";
import { ErrorResponse, SuccessResponse } from "../../../utils/responseUtil";
import { Request, Response } from "express";

export default class StudentCourseController {
    private studentCourseServices: StudentCourseServices

    constructor(studentCourseServices: StudentCourseServices) {
        this.studentCourseServices = studentCourseServices
    }

    async studentGetAllCourses(req: Request, res: Response): Promise<void> {
        try {
            const { page = 1, limit = 6 } = req.query;
            console.log('req.query ', page, limit)
            const getAllCourses = await this.studentCourseServices.studentGetAllCourses(String(page), String(limit))
            SuccessResponse(res, 200, "All Course Got It", getAllCourses)
            return
        } catch (error: unknown) {
            console.log('error on get all course: ', error)
            if (error instanceof Error) {
                if (error.name === 'CoursesNotFound') {
                    ErrorResponse(res, 404, "Courses Not Found")
                    return
                }
            }
            ErrorResponse(res, 500, "Internal Server Error")
            return
        }
    }

    async studentCourseFilterData(req: Request, res: Response): Promise<void> {
        try {
            const { page = 1, limit = 6 } = req.query;
            const { selectedCategory, selectedLevel, searchTerm } = req.query
            const filteredCourse = await this.studentCourseServices.studentCourseFilterData(
                {
                    pageNumber: Number(page),
                    limitNumber: Number(limit),
                    selectedCategory: String(selectedCategory),
                    selectedLevel: String(selectedLevel),
                    searchTerm: String(searchTerm)
                }
            )

            SuccessResponse(res, 200, "Data Filtered", filteredCourse)
            return;
        } catch (error: unknown) {
            if (error instanceof Error) {
                if (error.name === 'CourseNotFound') {
                    ErrorResponse(res, 404, "Courses Not Found")
                    return
                }
            }
            console.info('error ', error)
            ErrorResponse(res, 500, "Internal Server Error")
            return
        }
    }

    async studentGetCourse(req: Request, res: Response): Promise<void> {
        try {
            const courseId = req.query.courseId
            const studentId = req?.query?.userId
            const getCourse = await this.studentCourseServices.studentGetCourse(String(courseId), String(studentId))
            SuccessResponse(res, 200, "Course Got It", getCourse)
            return
        } catch (error: unknown) {
            console.info('getCourse: ', error)
            ErrorResponse(res, 500, "Internal Server Error")
            return
        }
    }

    async studentGetCoursePlay(req: Request, res: Response): Promise<void> {
        try {
            const courseId = req.query.courseId
            const studentId = await getId('accessToken', req) as string
            const getCoursePlay = await this.studentCourseServices.studentGetCoursePlay(String(courseId), studentId)
            SuccessResponse(res, 200, "Course Got It", getCoursePlay)
            return
        } catch (error: unknown) {
            console.info('getCoursePlay: ', error)
            if (error instanceof Error) {
                if (error.name === 'CourseNotFound') {
                    ErrorResponse(res, 404, "Course Not Found")
                }
            }
            ErrorResponse(res, 500, "Internal Server Error")
            return
        }
    }

    async studentBuyCourse(req: Request, res: Response): Promise<void> {
        try {
            const { courseId, txnid, amount, courseName } = req.body
            console.log(courseId, txnid, amount, courseId)
            const userId = await getId('accessToken', req) as string
            const buyCourse = await this.studentCourseServices.studentBuyCourse({ userId, courseId, txnid, amount })
            SuccessResponse(res, 200, "Course Buyed Successfully", buyCourse)
            return
        } catch (error: unknown) {
            console.info('payment error ', error)
            if (error instanceof Error) {
                ErrorResponse(res, 404, "Chapters Not Found")
                return
            }
            ErrorResponse(res, 500, "Internal Server Error")
            return
        }
    }

    async studentBuyedCourses(req: Request, res: Response): Promise<void> {
        try {
            console.log('buyedCourse controller ', req.query)
            const { page = 1, limit = 4 } = req.query;
            const studentId = await getId('accessToken', req) as string
            const buyedCourse = await this.studentCourseServices.studentBuyedCourses(studentId, String(page), String(limit))
            SuccessResponse(res, 200, "Buyed Courses Got It", buyedCourse)
            return
        } catch (error: unknown) {
            console.info('BuyedCourses :', error)
            ErrorResponse(res, 500, "Internal Server Error")
            return
        }
    }

    async studentCoursePlay(req: Request, res: Response): Promise<void> {
        try {
            const purchaseId = req.query.buyedId
            const studentId = await getId('accessToken', req) as string
            const coursePlay = await this.studentCourseServices.studentCoursePlay(String(purchaseId), studentId)
            SuccessResponse(res, 200, "Course Got It For Play", coursePlay)
            return
        } catch (error: unknown) {
            ErrorResponse(res, 500, "Internal Server Error")
            return
        }
    }

    async studentChapterVideoEnd(req: Request, res: Response): Promise<void> {
        try {
            const { chapterId, studiedTime } = req.query
            const studentId = await getId('accessToken', req) as string
            const findCoures = await this.studentCourseServices.studentChapterVideoEnd(String(chapterId), String(studiedTime), studentId)
            SuccessResponse(res, 200, "Chapter Video Ended", findCoures)
            return
        } catch (error: unknown) {
            console.log('chap end ', error)
            ErrorResponse(res, 500, "Internal Server Error")
            return
        }
    }

    async studentIsVerified(req: Request, res: Response): Promise<void> {
        try {
            const userId = await getId('accessToken', req)
            SuccessResponse(res, 200, "Student Verified")
            return
        } catch (error: unknown) {
            ErrorResponse(res, 500, "Internal Server Error")
            return
        }
    }

    async studentCompleteCourse(req: Request, res: Response): Promise<void> {
        try {
            const studentId = await getId('accessToken', req)
            const { courseId } = req.query
            const completeCourse = await this.studentCourseServices.studentCompleteCourse(String(studentId), String(courseId))
            SuccessResponse(res, 200, "Corse Completed", completeCourse)
            return
        } catch (error: unknown) {
            if (error instanceof Error) {
                if (error.name === "CourseAlreadyCompleted") {
                    ErrorResponse(res, 401, "Course Already Completed")
                    return
                }
            }
            ErrorResponse(res, 500, "Internal Server Error")
            return
        }
    }

    async studentQuizz(req: Request, res: Response): Promise<void> {
        try {
            const { courseId } = req.query
            const studentId = await getId('accessToken', req) as string
            const getQuizz = await this.studentCourseServices.studentQuizz(String(courseId), studentId)
            SuccessResponse(res, 200, "Quizz Got It", getQuizz)
            return
        } catch (error: unknown) {
            ErrorResponse(res, 500, "Internal Server Error")
            return
        }
    }

    async studentCheckAlreadyBuyed(req: Request, res: Response): Promise<void> {
        try {
            const { courseId } = req.params
            const studentId = await getId('accessToken', req) as string
            const checkBuyed = await this.studentCourseServices.studentCheckAlreadyBuyed(courseId, studentId)
            if (!checkBuyed) {
                SuccessResponse(res, 200, 'Not Already Buyed', checkBuyed)
                return
            }
            SuccessResponse(res, 200, 'Already Buyed', checkBuyed)
            return
        } catch (error: unknown) {
            ErrorResponse(res, 500, "Internal Server Error")
            return
        }
    }

}

export const studentCourseController = new StudentCourseController(courseServices)