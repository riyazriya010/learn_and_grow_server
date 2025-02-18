import AdminCategoryServices, { adminCategoryServices } from "../../../services/business/adminServices/category.services";
import { Request, Response } from "express";
import { ErrorResponse, SuccessResponse } from "../../../utils/responseUtil";

export default class AdminCategoryController {
    private adminCategoryServices: AdminCategoryServices

    constructor(adminCategoryServices: AdminCategoryServices) {
        this.adminCategoryServices = adminCategoryServices
    }

    async adminAddCategory(req: Request, res: Response): Promise<any> {
        try {
            const { categoryName } = req.body
            const data = categoryName
            const response = await this.adminCategoryServices.adminAddCategory(data)

            SuccessResponse(res, 200, 'Category Added', response)
            return

        } catch (error: unknown) {
            if(error instanceof Error){
                if(error.name === 'CategoryAlreadyExists'){
                    ErrorResponse(res, 403, 'Category Already Exists')
            return
                }
            }
            ErrorResponse(res, 500, 'Internal Server Error')
            return
        }
    }

    async adminEditCategory(req: Request, res: Response): Promise<any> {
        try {
            const { categoryId } = req.query
            const { categoryName } = req.body

            const response = await this.adminCategoryServices.adminEditCategory(categoryName, String(categoryId))

            SuccessResponse(res, 200, 'Category Edited', response)
            return

        } catch (error: unknown) {
            if(error instanceof Error){
                if(error.name === 'CategoryAlreadyExists'){
                    ErrorResponse(res, 403, 'Category Already Exists')
            return
                }
            }
            ErrorResponse(res, 500, 'Internal Server Error')
            return
        }
    }


    async adminUnListCategory(req: Request, res: Response): Promise<any> {
        try {
            const { categoryId } = req.query
            const response = await this.adminCategoryServices.adminUnListCategory(String(categoryId))
            SuccessResponse(res, 200, "Category UnListed", response)
            return
        } catch (error: unknown) {
            ErrorResponse(res, 500, 'Internal Server Error')
            return
        }
    }



    async adminListCategory(req: Request, res: Response): Promise<any> {
        try {
            const { categoryId } = req.query
            const response = await this.adminCategoryServices.adminListCategory(String(categoryId))
            SuccessResponse(res, 200, "Category Listed", response)
            return
        } catch (error: unknown) {
            ErrorResponse(res, 500, 'Internal Server Error')
            return
        }
    }

    async adminGetAllCategory(req: Request, res: Response): Promise<any> {
        try {

            const { page = 1, limit = 4 } = req.query;

            const pageNumber = parseInt(page as string, 10);
            const limitNumber = parseInt(limit as string, 10);

            if (pageNumber < 1 || limitNumber < 1) {
                const error = new Error('Invalid Page Or Limit')
                error.name = 'InvalidPageOrLimit'
                throw error
            }

            const response = await this.adminCategoryServices.adminGetAllCategory(
                pageNumber,
                limitNumber,
            )

            return res.status(200).send({
                message: 'Categories Got It Successfully',
                success: true,
                result: response
            });

        } catch (error: unknown) {
            console.log('Category Get Error: ',error)
            if (error instanceof Error) {
                if (error.name === 'InvalidPageOrLimit') {
                    ErrorResponse(res, 401, 'InvalidPageOrLimit')
                    return
                }
            }
            ErrorResponse(res, 500, 'Internal Server Error')
            return
        }
    }

}

export const adminCategoryController = new AdminCategoryController(adminCategoryServices)

