import StudentRewardRepository from "../../../repositories/entities/studentRepository/reward.repository";

export default class StudentRewardServices {
    private studentRewardRepository: StudentRewardRepository

    constructor(studentRewardRepository: StudentRewardRepository){
        this.studentRewardRepository = studentRewardRepository
    }

    async studentRewardConvert(badgeId: string, studentId: string): Promise<any> {
        try{
            const convertBadge = await this.studentRewardRepository.studentRewardConvert(badgeId, studentId)
            return convertBadge
        }catch(error: unknown){
            throw error
        }
    }

    async studentWallet(studentId: string, page: string, limit: string): Promise<any> {
        try{
            const pageNumber = parseInt(page as string, 10)
            const limitNumber = parseInt(limit as string, 10)
            const getWallet = await this.studentRewardRepository.studentWallet(studentId, pageNumber, limitNumber)
            return getWallet
        }catch(error: unknown){
            throw error
        }
    }

    async studentWalletBalance(studentId: string): Promise<any> {
        try{
            const getBalance = await this.studentRewardRepository.studentWalletBalance(studentId)
            return getBalance
        }catch(error: unknown){
            throw error
        }
    }

    async studentwalletBuyCourse(studentId: string, price: string, courseId: string): Promise<any> {
        try{
            const buyCourse = await this.studentRewardRepository.studentwalletBuyCourse(studentId, price, courseId)
            return buyCourse
        }catch(error: unknown){
            throw error
        }
    }
}

const studentRewardRepository = new StudentRewardRepository()
export const studentRewardServices = new StudentRewardServices(studentRewardRepository)
