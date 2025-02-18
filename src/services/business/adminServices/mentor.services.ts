import AdminMentorRepository from "../../../repositories/entities/adminRepositories/mentor.repository";


export default class AdminMentorServices {
    private adminMentorRepository: AdminMentorRepository

    constructor(adminMentorRepository: AdminMentorRepository) {
        this.adminMentorRepository = adminMentorRepository;
    }

    async adminGetMentors(page: number, limit: number): Promise<any> {
        try {
            const response = await this.adminMentorRepository.adminGetMentors(page, limit)
            return response
        } catch (error: unknown) {
            throw error
        }
    }

    async adminBlockMentor(id: string): Promise<any> {
        try {
            const response = await this.adminMentorRepository.adminBlockMentor(id)
            return response
        } catch (error: unknown) {
            throw error
        }
    }

    async adminUnBlockMentor(id: string): Promise<any> {
        try {
            const response = await this.adminMentorRepository.adminUnBlockMentor(id)
            return response
        } catch (error: unknown) {
            throw error
        }
    }

}

const adminmentorRepository = new AdminMentorRepository()
export const adminMentorServices = new AdminMentorServices(adminmentorRepository)
