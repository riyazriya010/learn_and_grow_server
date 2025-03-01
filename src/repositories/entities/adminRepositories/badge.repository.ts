import { IAdminBadgeMethods } from "../../../interface/admin/admin.interface"
import { BadgeManagementModel, IBadgeManagement } from "../../../models/adminBadge.model"
import CommonBaseRepository from "../../baseRepositories/commonBaseRepository"




export default class AdminBadgeRepository extends CommonBaseRepository<{
    Badge: IBadgeManagement
}> implements IAdminBadgeMethods {

    constructor() {
        super({
            Badge: BadgeManagementModel
        })
    }

    async adminAddBadge(data: { badgeName: string; description: string; value: string }): Promise<IBadgeManagement | null> {
        try {
            const isExist = await this.findOne('Badge', {
                badgeName: data.badgeName
            });

            if (isExist) {
                const error = new Error("Badge Already Exists");
                error.name = "BadgeAlreadyExists";
                throw error;
            }

            const addBadge = await this.createData('Badge', data)
            const savedBadge = await addBadge.save()
            return savedBadge
        } catch (error: unknown) {
            throw error
        }
    }

    async adminEditBadge(badgeId: string, data: { badgeName: string; description: string; value: string }): Promise<IBadgeManagement | null> {
        try {
            const isExist = await this.findOne('Badge', {
                badgeName: data.badgeName,
                _id: { $ne: badgeId },
            });

            if (isExist) {
                const error = new Error("Badge Already Exists");
                error.name = "BadgeAlreadyExists";
                throw error;
            }

            const editBadge = await this.updateById('Badge', badgeId, { $set: data })
            return editBadge
        } catch (error: unknown) {
            throw error
        }
    }

    async adminGetBadges(page: number, limit: number): Promise<any | null> {
        try {
            const skip = (page - 1) * limit;

            const response = await this.findAll('Badge')
                .skip(skip)
                .limit(limit)
                .sort({ createdAt: -1 });

            const totalCourses = await this.findAll('Badge').countDocuments();

            const data = {
                badges: response,
                currentPage: page,
                totalPages: Math.ceil(totalCourses / limit),
                totalCourses: totalCourses
            };
            return data
        } catch (error: unknown) {
            throw error
        }
    }
    
}