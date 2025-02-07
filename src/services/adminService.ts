import { AdminRepository } from "../repositories/adminRepository";

export class AdminServices {
    private adminRepository: AdminRepository

    constructor(){
        this.adminRepository = new AdminRepository()
    }

    async getUsers(page: number, limit: number): Promise<any> {
        try{
            const response = await this.adminRepository.getUsers(page, limit)
            return response
        }catch(error){
            throw error
        }
    }

    async getMentors(page: number, limit: number): Promise<any> {
        try{
            const response = await this.adminRepository.getMentors(page, limit)
            return response
        }catch(error){
            throw error
        }
    }

    async blockMentor(id: string): Promise<any> {
        try{
            const response = await this.adminRepository.blockMentor(id)
            return response
        }catch(error){
            throw error
        }
    }

    async unBlockMentor(id: string): Promise<any> {
        try{
            const response = await this.adminRepository.unBlockMentor(id)
            return response
        }catch(error){
            throw error
        }
    }

    async blockUser(id: string): Promise<any> {
        try{
            const response = await this.adminRepository.blockUser(id)
            return response
        }catch(error){
            throw error
        }
    }

    async unBlockUser(id: string): Promise<any> {
        try{
            const response = await this.adminRepository.unBlockUser(id)
            return response
        }catch(error){
            throw error
        }
    }


    /*------------------------------------- WEEK - 2 --------------------------*/
    async addCategory(data: string): Promise<any> {
        try {
            const response = await this.adminRepository.addCategory(data)
            return response
        } catch (error: any) {
            throw error
        }
    }


    async editCategory(categoryName: string, categoryId: string): Promise<any> {
        try {
            const response = await this.adminRepository.editCategory(categoryName, categoryId)
            return response
        } catch (error) {
            throw error
        }
    }


    async unListCategory(categoryId: string): Promise<any> {
        try{
            const response = await this.adminRepository.unListCategory(categoryId)
            return response
        }catch(error: any){
            throw error
        }
    }


    async listCategory(categoryId: string): Promise<any> {
        try{
            const response = await this.adminRepository.listCategory(categoryId)
            return response
        }catch(error: any){
            throw error
        }
    }



    async getAllCategory(page: number, limit: number): Promise<any> {
        try{
            const response = await this.adminRepository.getAllCategory(page, limit)
            return response
        }catch(error){
            console.log(error)
        }
    }


    async getAllCourse(page: number, limit: number): Promise<any> {
        try{
            const response = await this.adminRepository.getAllCourse(page, limit)
            return response
        }catch(error){
            console.log(error)
        }
    }


    async unListCourse(courseId: string): Promise<any> {
        try{
            const response = await this.adminRepository.unListCourse(courseId)
            return response
        }catch(error: any){
            throw error
        }
    }


    async listCourse(courseId: string): Promise<any> {
        try{
            const response = await this.adminRepository.listCourse(courseId)
            return response
        }catch(error: any){
            throw error
        }
    }


    async getWallet(userId: string, pageNumber: number, limitNumber: number): Promise<any> {
        try{
            const response  = await this.adminRepository.getWallet(userId, pageNumber, limitNumber)
            return response
        }catch(error: any){
            throw error
        }
    }


    ////////////////////////////////////// WEEK - 4 ////////////////////////////
    
    async adminNonApprovedCourse(page: number, limit: number): Promise<any> {
        try{
            const getNotApprovedCourse = await this.adminRepository.adminNonApprovedCourse(page, limit)
            return getNotApprovedCourse
        }catch(error: any){
            throw error
        }
    }

    async adminNonApprovedCourseDetails(courseId: string): Promise<any> {
        try{
            const getDetails = await this.adminRepository.adminNonApprovedCourseDetails(courseId)
            return getDetails
        }catch(error: any){
            throw error
        }
    }

    async adminDashboard(): Promise<any> {
        try{
            const getDashboard = await this.adminRepository.adminDashboard()
            return getDashboard
        }catch(error: any){
            throw error
        }
    }

    async adminChartGraph(filters: any): Promise<any> {
        try{
            const getChart = await this.adminRepository.adminChartGraph(filters)
            return getChart
        }catch(error: any){
            throw error
        }
    }

    async adminSalesReport(filters: any): Promise<any> {
        try{
            const getReport = await this.adminRepository.adminSalesReport(filters)
            return getReport
        }catch(error: any){
            throw error
        }
    }

    async adminApproveCourse(courseId: string): Promise<any> {
        try{
            const approveIt = await this.adminRepository.adminApproveCourse(courseId)
            return approveIt
        }catch(error: any){
            throw error
        }
    }
}