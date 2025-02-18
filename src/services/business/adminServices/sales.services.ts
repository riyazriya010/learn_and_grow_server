import AdminSalesRepository from "../../../repositories/entities/adminRepositories/sales.repository";



export default class AdminSalesServices {
    private adminSalesRepository: AdminSalesRepository

    constructor(adminSalesRepository: AdminSalesRepository) {
        this.adminSalesRepository = adminSalesRepository;
    }

    async adminDashboard(): Promise<any> {
        try{
            const getDashboard = await this.adminSalesRepository.adminDashboard()
            return getDashboard
        }catch(error: any){
            throw error
        }
    }

    async adminChartGraph(filters: any): Promise<any> {
        try{
            const getChart = await this.adminSalesRepository.adminChartGraph(filters)
            return getChart
        }catch(error: any){
            throw error
        }
    }

    async adminSalesReport(filters: any): Promise<any> {
        try{
            const getReport = await this.adminSalesRepository.adminSalesReport(filters)
            return getReport
        }catch(error: any){
            throw error
        }
    }

}

const adminSalesRepository = new AdminSalesRepository()
export const adminSalesServices = new AdminSalesServices(adminSalesRepository)
