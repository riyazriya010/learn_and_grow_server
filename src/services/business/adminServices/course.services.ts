import AdminCourseRepository from "../../../repositories/entities/adminRepositories/course.repository";


export default class AdminCourseServices {
    private adminCourseRepository: AdminCourseRepository

    constructor(adminCourseRepository: AdminCourseRepository) {
        this.adminCourseRepository = adminCourseRepository;
    }

    async adminGetAllCourse(page: number, limit: number): Promise<any> {
        try {
            const response = await this.adminCourseRepository.adminGetAllCourse(page, limit)
            return response
        } catch (error: unknown) {
            throw error
        }
    }


    async adminUnListCourse(courseId: string): Promise<any> {
        try {
            const response = await this.adminCourseRepository.adminUnListCourse(courseId)
            return response
        } catch (error: unknown) {
            throw error
        }
    }


    async adminListCourse(courseId: string): Promise<any> {
        try {
            const response = await this.adminCourseRepository.adminListCourse(courseId)
            return response
        } catch (error: unknown) {
            throw error
        }
    }

    async adminNonApprovedCourse(page: number, limit: number): Promise<any> {
        try {
            const getNotApprovedCourse = await this.adminCourseRepository.adminNonApprovedCourse(page, limit)
            return getNotApprovedCourse
        } catch (error: unknown) {
            throw error
        }
    }

    async adminNonApprovedCourseDetails(courseId: string): Promise<any> {
        try {
            const getDetails = await this.adminCourseRepository.adminNonApprovedCourseDetails(courseId)
            return getDetails
        } catch (error: unknown) {
            throw error
        }
    }

    async adminApproveCourse(courseId: string): Promise<any> {
        try {
            const approveIt = await this.adminCourseRepository.adminApproveCourse(courseId)
            return approveIt
        } catch (error: unknown) {
            throw error
        }
    }


    async adminGetWallet(userId: string, pageNumber: number, limitNumber: number): Promise<any> {
        try {
            const response = await this.adminCourseRepository.adminGetWallet(userId, pageNumber, limitNumber)
            return response
        } catch (error: unknown) {
            throw error
        }
    }


}

const adminCourseRepository = new AdminCourseRepository()
export const adminCourseServices = new AdminCourseServices(adminCourseRepository)
