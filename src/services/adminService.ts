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
}