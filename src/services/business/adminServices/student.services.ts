import AdminStudentRepository from "../../../repositories/entities/adminRepositories/student.repository";


export default class AdminStudentServices {
    private adminStudentRepository: AdminStudentRepository

    constructor(adminStudentRepository: AdminStudentRepository) {
        this.adminStudentRepository = adminStudentRepository;
    }

    async adminGetStudents(page: number, limit: number): Promise<any> {
        try {
            const response = await this.adminStudentRepository.adminGetStudents(page, limit)
            return response
        } catch (error: unknown) {
            throw error
        }
    }

    async adminBlockStudent(id: string): Promise<any> {
        try {
            const response = await this.adminStudentRepository.adminBlockStudent(id)
            return response
        } catch (error: unknown) {
            throw error
        }
    }

    async adminUnBlockStudent(id: string): Promise<any> {
        try {
            const response = await this.adminStudentRepository.adminUnBlockStudent(id)
            return response
        } catch (error: unknown) {
            throw error
        }
    }

    async addTokens(accessToken: any, refreshToken: any): Promise<any> {
        try {
            const addToken = await this.adminStudentRepository.addToken(accessToken, refreshToken)
            return addToken
        } catch (error: unknown) {
            throw error
        }
    }

}

const adminStudentRepository = new AdminStudentRepository()
export const adminStudentServices = new AdminStudentServices(adminStudentRepository)
