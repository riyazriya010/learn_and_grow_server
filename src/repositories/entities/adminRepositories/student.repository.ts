import { IAdminStudentMethods } from "../../../interface/admin/admin.interface";
import BlacklistedTokenModel, { IBlacklistedToken } from "../../../models/tokenBlackList.model";
import UserModel, { IUser } from "../../../models/user.model";
import CommonBaseRepository from "../../baseRepositories/commonBaseRepository";



export default class AdminStudentRepository extends CommonBaseRepository<{
    User: IUser;
    Token: IBlacklistedToken;
}> implements IAdminStudentMethods {

    constructor() {
        super({
            User: UserModel,
            Token: BlacklistedTokenModel

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


    async addToken(accessToken: string, refreshToken: string): Promise<any> {
        try {
            const existingAccess = await this.findOne('Token', { token: accessToken });
            if (!existingAccess) {
                await this.createData('Token', { token: accessToken });
            }

            const existingRefresh = await this.findOne('Token', { token: refreshToken });
            if (!existingRefresh) {
                await this.createData('Token', { token: refreshToken });
            }

            return { access: accessToken, refresh: refreshToken };
        } catch (error: unknown) {
            throw error;
        }
    }

}