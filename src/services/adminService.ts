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
}