import { IAdminCategoryMethods } from "../../../interface/admin/admin.interface"
import { CategoryModel, ICategory } from "../../../models/categroy.model"
import AdminCategoryBaseRepository from "../../baseRepositories/adminBaseRepositories/categoryBaseRepository"
import CommonBaseRepository from "../../baseRepositories/commonBaseRepository"



export default class AdminCategoryRepository extends CommonBaseRepository<{
    Category: ICategory
}> implements IAdminCategoryMethods {

    constructor() {
        super({
            Category: CategoryModel
        })
    }

    async adminAddCategory(data: string): Promise<any> {
        try {
            const isExist = await this.findOne('Category',{ categoryName: data })
            if (isExist) {
                const error = new Error('Category Already Exist')
                error.name = 'CategoryAlreadyExists'
                throw error
            }
            const categoryData = {
                categoryName: data
            }
            const document = await this.createData('Category',categoryData)
            const savedCategory = await document.save()

            return savedCategory
        } catch (error: unknown) {
            throw error
        }
    }

    async adminEditCategory(categoryName: string, categoryId: string): Promise<any> {
        try {
            const isExist = await this.findOne('Category',{
                categoryName: categoryName,
                _id: { $ne: categoryId },
            });

            if (isExist) {
                const error = new Error("Category Already Exists");
                error.name = "CategoryAlreadyExists";
                throw error;
            }

            const updatedCategory = await this.updateById('Category',
                categoryId,
                { $set: { categoryName: categoryName } }
            );

            if (!updatedCategory) {
                const error = new Error("Category Not Found");
                error.name = "CategoryNotFoundError";
                throw error;
            }

            return updatedCategory;
        } catch (error: unknown) {
            throw error
        }
    }

    async adminUnListCategory(categoryId: string): Promise<any> {
        try {
            const unListedCategory = await this.updateById('Category',
                categoryId,
                { isListed: false }
            )
            return unListedCategory
        } catch (error: unknown) {
            throw error
        }
    }

    async adminListCategory(categoryId: string): Promise<any> {
        try {
            const unListedCategory = await this.updateById('Category',
                categoryId,
                { isListed: true }
            )
            return unListedCategory
        } catch (error: unknown) {
            throw error
        }
    }

    async adminGetAllCategory(page: number = 1, limit: number = 3): Promise<any> {
        try {
            const skip = (page - 1) * limit;

            const response = await this.findAll('Category')
                .skip(skip)
                .limit(limit)
                .sort({ createdAt: -1 });

            const totalCourses = await this.findAll('Category').countDocuments();

            if (!response || response.length === 0) {
                const error = new Error('Category Not Found');
                error.name = 'CategoryNotFound';
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

}

