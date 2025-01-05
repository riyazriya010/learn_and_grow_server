import { AdminRepository } from "../repositories/adminRepository";

export class AdminServices {
    private adminRepository: AdminRepository

    constructor(){
        this.adminRepository = new AdminRepository()
    }

    async getUsers(): Promise<any> {
        try{
            const response = await this.adminRepository.getUsers()
            return response
        }catch(error){
            console.log(error)
        }
    }

    async getMentors(): Promise<any> {
        try{
            const response = await this.adminRepository.getMentors()
            return response
        }catch(error){
            console.log(error)
        }
    }

    async blockMentor(id: string): Promise<any> {
        try{
            const response = await this.adminRepository.blockMentor(id)
            return response
        }catch(error){
            console.log(error)
        }
    }

    async unBlockMentor(id: string): Promise<any> {
        try{
            const response = await this.adminRepository.unBlockMentor(id)
            return response
        }catch(error){
            console.log(error)
        }
    }

    async blockUser(id: string): Promise<any> {
        try{
            const response = await this.adminRepository.blockUser(id)
            return response
        }catch(error){
            console.log(error)
        }
    }

    async unBlockUser(id: string): Promise<any> {
        try{
            const response = await this.adminRepository.unBlockUser(id)
            return response
        }catch(error){
            console.log(error)
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
            console.log(error)
        }
    }


    async getAllCategory(): Promise<any> {
        try{
            const response = await this.adminRepository.getAllCategory()
            return response
        }catch(error){
            console.log(error)
        }
    }
}