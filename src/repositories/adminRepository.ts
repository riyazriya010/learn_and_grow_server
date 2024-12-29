import MentorModel, { IMentor } from "../models/mentor.model";
import UserModel, { IUser } from "../models/user.model"
import { AdminBaseRepository } from "./baseRepo/adminBase.repository"

export class AdminRepository {
    private mentorBaseRepository: AdminBaseRepository<IMentor>;
    private userBaseRepository: AdminBaseRepository<IUser>;

    constructor(){
        this.userBaseRepository = new AdminBaseRepository<IUser>(UserModel)
        this.mentorBaseRepository = new AdminBaseRepository<IMentor>(MentorModel)
    }

    async getUsers(): Promise<any> {
        try{
            const response = await this.userBaseRepository.getUsers()
            return response
        }catch(error){
            console.log(error)
        }
    }

    async getMentors(): Promise<any> {
        try{
            const response = await this.mentorBaseRepository.getMentors()
            return response
        }catch(error){
            console.log(error)
        }
    }

    async blockMentor(id: string): Promise<any> {
        try {
            const response = await this.mentorBaseRepository.blockMentor(id);
            return response;
        } catch (error) {
            console.error('Error in AdminRepository while blocking mentor:', error);
            throw new Error('Failed to block mentor in AdminRepository');
        }
    }

    async unBlockMentor(id: string): Promise<any> {
        try {
            const response = await this.mentorBaseRepository.unBlockMentor(id);
            return response;
        } catch (error) {
            console.error('Error in AdminRepository while Unblocking mentor:', error);
            throw new Error('Failed to Unblock mentor in AdminRepository');
        }
    }


    async blockUser(id: string): Promise<any> {
        try {
            const response = await this.userBaseRepository.blockUser(id);
            return response;
        } catch (error) {
            console.error('Error in AdminRepository while blocking User:', error);
            throw new Error('Failed to block User in AdminRepository');
        }
    }


    async unBlockUser(id: string): Promise<any> {
        try {
            const response = await this.userBaseRepository.unBlockUser(id);
            return response;
        } catch (error) {
            console.error('Error in AdminRepository while Unblocking User:', error);
            throw new Error('Failed to Unblock User in AdminRepository');
        }
    }
}

