import MentorSalesRepository from "../../../repositories/entities/mentorRepositories/sales.repository";


export default class MentorSalesServices {
    private mentorSalesRepository: MentorSalesRepository

    constructor(mentorSalesRepository: MentorSalesRepository) {
        this.mentorSalesRepository = mentorSalesRepository;
    }

    async mentorDashboard(mentorId: string): Promise<any> {
        try{
            const getData = await this.mentorSalesRepository.mentorDashboard(mentorId)
            return getData
        }catch(error: unknown){
            throw error
        }
    }

    async mentorChartGraph(mentorId: string, filters: any): Promise<any> {
        try{
            const getData = await this.mentorSalesRepository.mentorChartGraph(mentorId, filters)
            return getData
        }catch(error: unknown){
            throw error
        }
    }

    async mentorSalesReport(mentorId: string, filters: any): Promise<any> {
        try{
            const getData = await this.mentorSalesRepository.mentorSalesReport(mentorId, filters)
            return getData
        }catch(error: unknown){
            throw error
        }
    }

}


const mentorSalesRepository = new MentorSalesRepository()
export const mentorSalesServices = new MentorSalesServices(mentorSalesRepository)

