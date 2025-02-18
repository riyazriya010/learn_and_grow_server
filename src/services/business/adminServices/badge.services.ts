import { IBadgeManagement } from "../../../models/adminBadge.model";
import AdminBadgeRepository from "../../../repositories/entities/adminRepositories/badge.repository";


export default class AdminBadgeServices {
    private adminBadgeRepository: AdminBadgeRepository

    constructor(adminBadgeRepository: AdminBadgeRepository) {
        this.adminBadgeRepository = adminBadgeRepository;
    }

    async adminAddBadge(data:  {badgeName: string, description: string, value: string}): Promise<IBadgeManagement |null>{
        try{
            const addBadge = await this.adminBadgeRepository.adminAddBadge(data)
            return addBadge
        }catch(error: unknown){
            throw error
        }
    }

    async adminEditBadge(badgeId: string, data: {badgeName: string, description: string, value: string}): Promise<IBadgeManagement | null>{
        try{
            const editBadge = await this.adminBadgeRepository.adminEditBadge(badgeId, data)
            return editBadge
        }catch(error: unknown){
            throw error
        }
    }

    async adminGetBadges(page: number, limit: number): Promise<IBadgeManagement[] | null>{
        try{
            const getBadge = await this.adminBadgeRepository.adminGetBadges(page, limit)
            return getBadge
        }catch(error: unknown){
            throw error
        }
    }
}

const adminBadgeRepository = new AdminBadgeRepository()
export const adminBadgeServices = new AdminBadgeServices(adminBadgeRepository)
