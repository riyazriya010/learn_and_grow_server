import AdminCategoryRepository from "../../../repositories/entities/adminRepositories/category.repository";




export default class AdminCategoryServices {
    private adminCategoryRepository: AdminCategoryRepository

    constructor(adminCategoryRepository: AdminCategoryRepository) {
        this.adminCategoryRepository = adminCategoryRepository;
    }

    async adminAddCategory(data: string): Promise<any> {
        try {
            const response = await this.adminCategoryRepository.adminAddCategory(data)
            return response
        } catch (error: unknown) {
            throw error
        }
    }


    async adminEditCategory(categoryName: string, categoryId: string): Promise<any> {
        try {
            const response = await this.adminCategoryRepository.adminEditCategory(categoryName, categoryId)
            return response
        } catch (error: unknown) {
            throw error
        }
    }


    async adminUnListCategory(categoryId: string): Promise<any> {
        try {
            const response = await this.adminCategoryRepository.adminUnListCategory(categoryId)
            return response
        } catch (error: unknown) {
            throw error
        }
    }


    async adminListCategory(categoryId: string): Promise<any> {
        try {
            const response = await this.adminCategoryRepository.adminListCategory(categoryId)
            return response
        } catch (error: unknown) {
            throw error
        }
    }



    async adminGetAllCategory(page: number, limit: number): Promise<any> {
        try {
            const response = await this.adminCategoryRepository.adminGetAllCategory(page, limit)
            return response
        } catch (error: unknown) {
            throw error
        }
    }


}

const adminCategoryRepository = new AdminCategoryRepository()
export const adminCategoryServices = new AdminCategoryServices(adminCategoryRepository)
