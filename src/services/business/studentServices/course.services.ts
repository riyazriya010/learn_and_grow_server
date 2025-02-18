import { StudentBuyCourseInput, studentCompleteCourse, StudentCourseFilterData, StudentCoursePlay, studentFilterCoursesOuput, studentGetAllCoursesOuput, studentGetBuyedCourses, StudentGetCourseOuput, StudentGetCoursePlayOutput } from "../../../interface/students/student.types";
import { IPurchasedCourse } from "../../../models/purchased.model";
import { IQuiz } from "../../../models/quizz.model";
import StudentCourseRepository from "../../../repositories/entities/studentRepository/course.repository";


export default class StudentCourseServices {
    private studentCourseRepository: StudentCourseRepository

    constructor(studentCourseRepository: StudentCourseRepository) {
        this.studentCourseRepository = studentCourseRepository;
    }

    async studentGetAllCourses(page: string, limit: string): Promise<studentGetAllCoursesOuput | null> {
        try {
            const pageNumber = parseInt(page as string, 10);
            const limitNumber = parseInt(limit as string, 10);

            if (pageNumber < 1 || limitNumber < 1) {
                const error = new Error('Invalid Page or Limit Value')
                error.name = 'InvalidPageOrLimit'
                throw error
            }
            const getAllCourse = await this.studentCourseRepository.studentGetAllCourses(pageNumber, limitNumber)
            return getAllCourse
        } catch (error: unknown) {
            throw error
        }
    }

    async studentCourseFilterData(filterData: StudentCourseFilterData): Promise<studentFilterCoursesOuput | null> {
        try {
            const pageNumber = parseInt(String(filterData.pageNumber) as string, 10);
            const limitNumber = parseInt(String(filterData.limitNumber) as string, 10);

            if (pageNumber < 1 || limitNumber < 1) {
                const error = new Error('Invalid Page or Limit Value')
                error.name = 'InvalidPageOrLimit'
                throw error
            }
            const filteredCourse = await this.studentCourseRepository.studentCourseFilterData(
                {
                    pageNumber,
                    limitNumber,
                    selectedCategory: filterData.selectedCategory,
                    selectedLevel: filterData.selectedLevel,
                    searchTerm: filterData.searchTerm
                }
            )
            return filteredCourse
        } catch (error: unknown) {
            throw error
        }
    }

    async studentGetCourse(courseId: string, studentId: string): Promise<StudentGetCourseOuput | null> {
        try {
            const findCourse = await this.studentCourseRepository.studentGetCourse(courseId, studentId)
            return findCourse
        } catch (error: unknown) {
            throw error
        }
    }

    async studentGetCoursePlay(courseId: string, studentId: string): Promise<StudentGetCoursePlayOutput | null> {
        try {
            const getCoursePlay = await this.studentCourseRepository.studentGetCoursePlay(courseId, studentId)
            return getCoursePlay
        } catch (error: unknown) {
            throw error
        }
    }

    async studentBuyCourse(purchaseData: StudentBuyCourseInput): Promise<IPurchasedCourse | null> {
        try {
            console.log('buy service')
            const buyCourse = await this.studentCourseRepository.studentBuyCourse(purchaseData)
            return buyCourse
        } catch (error: unknown) {
            throw error
        }
    }

    async studentBuyedCourses(studentId: string, page: string, limit: string): Promise<studentGetBuyedCourses | null> {
        try {
            const pageNumber = parseInt(page as string, 10)
            const limitNumber = parseInt(limit as string, 10)
            const buyedCourse = await this.studentCourseRepository.studentBuyedCourses(studentId, pageNumber, limitNumber)

            if (buyedCourse?.courses) {
                const formattedResponse = buyedCourse?.courses?.map((course: any) => ({
                    _id: course._id,
                    courseDetails: {
                        courseName: course.courseId.courseName,
                        level: course.courseId.level,
                    },
                    completedChapters: course.completedChapters,
                    isCourseCompleted: course.isCourseCompleted,
                    purchasedAt: course.purchasedAt,
                }));

                buyedCourse.courses = formattedResponse
            }

            return buyedCourse
        } catch (error: unknown) {
            throw error
        }
    }

    async studentCoursePlay(purchaseId: string, studentId: string): Promise<StudentCoursePlay | null> {
        try {
            const coursePlay = await this.studentCourseRepository.studentCoursePlay(purchaseId, studentId)
            return coursePlay
        } catch (error: unknown) {
            throw error
        }
    }

    async studentChapterVideoEnd(chapterId: string, studiedTime: string, studentId: string): Promise<IPurchasedCourse | null> {
        try {
            const findCoures = await this.studentCourseRepository.studentChapterVideoEnd(chapterId, studiedTime, studentId)
            return findCoures
        } catch (error: unknown) {
            throw error
        }
    }

    async studentCompleteCourse(studentId: string, courseId: string): Promise<studentCompleteCourse | null> {
        try {
            const completeCourse = await this.studentCourseRepository.studentCompleteCourse(studentId, courseId)
            return completeCourse
        } catch (error: unknown) {
            throw error
        }
    }

    async studentQuizz(courseId: string, studentId: string): Promise<IQuiz> {
        try {
            const getQuizz = await this.studentCourseRepository.studentQuizz(courseId, studentId)
            return getQuizz
        } catch (error: unknown) {
            throw error
        }
    }

    async studentCheckAlreadyBuyed(courseId: string, studentId: string): Promise<IPurchasedCourse | null> {
        try{
            const checkBuyed = await this.studentCourseRepository.studentCheckAlreadyBuyed(courseId, studentId)
            return checkBuyed
        }catch(error: unknown){
            throw error
        }
    }
}

const courseRepository = new StudentCourseRepository()
export const courseServices = new StudentCourseServices(courseRepository)