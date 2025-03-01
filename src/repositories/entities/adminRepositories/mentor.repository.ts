import { IAdminMentorMethods } from "../../../interface/admin/admin.interface"
import MentorModel, { IMentor } from "../../../models/mentor.model"
import CommonBaseRepository from "../../baseRepositories/commonBaseRepository"



export default class AdminMentorRepository extends CommonBaseRepository<{
    Mentor: IMentor
}> implements IAdminMentorMethods {

    constructor() {
        super({
            Mentor: MentorModel
        })
    }

    async adminGetMentors(page: number = 1, limit: number = 4): Promise<any> {
        try {
            const skip = (page - 1) * limit;

            const response = await this.findAll('Mentor')
                .skip(skip)
                .limit(limit)
                .sort({ createdAt: -1 });

            const totalCourses = await this.findAll('Mentor').countDocuments();

            if (!response || response.length === 0) {
                const error = new Error('Mentors Not Found');
                error.name = 'MentorsNotFound';
                throw error;
            }

            return {
                courses: response,
                currentPage: page,
                totalPages: Math.ceil(totalCourses / limit),
                totalCourses: totalCourses
            };
        } catch (error: unknown) {
            throw error
        }
    }

    async adminBlockMentor(id: string): Promise<any> {
        try {
            // Find the mentor by ID
            const mentor = await this.findById('Mentor',id)

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

        } catch (error: unknown) {
            throw error
        }
    }

    async adminUnBlockMentor(id: string): Promise<any> {
        try {
            const mentor = await this.findById('Mentor',id)

            if (!mentor) {
                throw new Error('Mentor not found');
            }

            const mentorToUpdate = mentor as unknown as IMentor;

            mentorToUpdate.isBlocked = false;

            const updatedMentor = await mentor.save();

            return updatedMentor as unknown as IMentor;

        } catch (error: unknown) {
            throw error
        }
    }

}