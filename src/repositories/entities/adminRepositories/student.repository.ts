import { IAdminStudentMethods } from "../../../interface/admin/admin.interface";
import UserModel, { IUser } from "../../../models/user.model";
import CommonBaseRepository from "../../baseRepositories/commonBaseRepository";



export default class AdminStudentRepository extends CommonBaseRepository<{
    User: IUser
}> implements IAdminStudentMethods {

    constructor() {
        super({
            User: UserModel
        })
    }

    async adminGetStudents(page: number = 1, limit: number = 4): Promise<any> {
        try {
            const skip = (page - 1) * limit;

            const response = await this.findAll('User')
                .skip(skip)
                .limit(limit)
                .sort({ createdAt: -1 })

            const totalCourses = await this.findAll('User').countDocuments();

            if (!response || response.length === 0) {
                const error = new Error('Users Not Found');
                error.name = 'UsersNotFound';
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


    async adminBlockStudent(id: string): Promise<any> {
        try {
            const updatedUser = await this.updateById('User',
                id,
                { isBlocked: true },
            )

            if (!updatedUser) {
                throw new Error('User not found');
            }

            return updatedUser as unknown as IUser;
        } catch (error: unknown) {
            throw error
        }
    }

    async adminUnBlockStudent(id: string): Promise<any> {
        try {
            const updatedUser = await this.updateById('User',
                id,
                { isBlocked: false },
            )

            if (!updatedUser) {
                throw new Error('User not found');
            }

            return updatedUser as unknown as IUser;
        } catch (error: unknown) {
            throw error
        }
    }

}