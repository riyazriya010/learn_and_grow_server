import { Model, Document } from "mongoose"
import { IMentor } from "../../models/mentor.model"
import { IUser } from "../../models/user.model"

export class AdminBaseRepository<T extends Document> {
    private model: Model<T>

    constructor(model: Model<T>) {
        this.model = model
    }

    async getUsers(): Promise<any> {
        try {
            const response = await this.model.find()
            return response
        } catch (error) {
            console.log(error)
        }
    }

    async getMentors(): Promise<any> {
        try {
            const response = await this.model.find()
            return response
        } catch (error) {
            console.log(error)
        }
    }

    async blockMentor(id: string): Promise<any> {
        try {
            // Find the mentor by ID
            const mentor = await this.model.findById(id).exec();
    
            // Check if the mentor exists
            if (!mentor) {
                throw new Error('Mentor not found');
            }

            const mentorToUpdate = mentor as unknown as IMentor;

            // Update the `isBlocked` field
             mentorToUpdate.isBlocked = true;
    
            // Save the updated mentor document
            const updatedMentor = await mentor.save();
    
            // Return the updated mentor
            return updatedMentor as unknown as IMentor;
    
        } catch (error) {
            // Log the error and rethrow it for further handling
            console.error('Error blocking mentor:', error);
            throw new Error('Failed to block mentor');
        }
    }

    async unBlockMentor(id: string): Promise<any> {
        try {
            const mentor = await this.model.findById(id).exec();
    
            if (!mentor) {
                throw new Error('Mentor not found');
            }

            const mentorToUpdate = mentor as unknown as IMentor;

             mentorToUpdate.isBlocked = false;
    
            const updatedMentor = await mentor.save();
    
            return updatedMentor as unknown as IMentor;
    
        } catch (error) {
            console.error('Error Unblocking mentor:', error);
            throw new Error('Failed to Unblock mentor');
        }
    }



    async blockUser(id: string): Promise<any> {
        try {
            const updatedUser = await this.model.findByIdAndUpdate(
                id,
                { isBlocked: true },
                { new: true } // Return the updated document
            ).exec();
    
            if (!updatedUser) {
                throw new Error('User not found');
            }
    
            return updatedUser as unknown as IUser;
        } catch (error) {
            console.error('Error blocking User:', error);
            throw new Error('Failed to block User');
        }
    }

    async unBlockUser(id: string): Promise<any> {
        try {
            const updatedUser = await this.model.findByIdAndUpdate(
                id,
                { isBlocked: false },
                { new: true } // Return the updated document
            ).exec();
    
            if (!updatedUser) {
                throw new Error('User not found');
            }
    
            return updatedUser as unknown as IUser;
        } catch (error) {
            console.error('Error Unblocking User:', error);
            throw new Error('Failed to Unblock User');
        }
    }

}
