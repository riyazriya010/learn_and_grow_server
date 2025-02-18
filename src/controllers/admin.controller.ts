import { Request, Response } from "express";
import { AdminServices } from "../services/adminService";
import { JwtService } from "../integration/jwt";
import { BadgeManagementModel } from "../models/adminBadge.model";

export class AdminController {
    private adminServices: AdminServices
    private jwtService: JwtService

    constructor() {
        this.adminServices = new AdminServices()
        this.jwtService = new JwtService()
    }

    async adminLogin(req: Request, res: Response): Promise<any> {
        try {
            const { email, password } = req.body

            if (email !== process.env.ADMIN_EMAIL || password !== process.env.ADMIN_PASSWORD) {
                return res.status(409).send({
                    message: 'Invalid Credential',
                    success: false
                })
            }

            const userJwtToken = await this.jwtService.createToken(String(email), 'admin')
            const userRefreshToken = await this.jwtService.createRefreshToken(String(email), 'admin')

            return res
                .status(200)
                .cookie('accessToken', userJwtToken, {
                    httpOnly: false
                }).cookie('refreshToken', userRefreshToken, {
                    httpOnly: true
                })
                .send({
                    success: true,
                    message: 'Admin Found Successfully',
                })

        } catch (error) {
            console.log(error)
        }
    }

    async getUsers(req: Request, res: Response): Promise<any> {
        try {
            const { page = 1, limit = 4 } = req.query;

            const pageNumber = parseInt(page as string, 10);
            const limitNumber = parseInt(limit as string, 10);

            if (pageNumber < 1 || limitNumber < 1) {
                return res
                    .status(400)
                    .send({
                        message: 'Invalid page or limit value',
                        success: false,
                    });
            }

            const response = await this.adminServices.getUsers(
                pageNumber,
                limitNumber,
            )

            return res.status(200).send({
                message: 'Users Got It Successfully',
                success: true,
                result: response
            });
        } catch (error) {
            console.log(error)
        }
    }

    async getMentors(req: Request, res: Response): Promise<any> {
        try {


            const { page = 1, limit = 4 } = req.query;

            const pageNumber = parseInt(page as string, 10);
            const limitNumber = parseInt(limit as string, 10);

            if (pageNumber < 1 || limitNumber < 1) {
                return res
                    .status(400)
                    .send({
                        message: 'Invalid page or limit value',
                        success: false,
                    });
            }

            const response = await this.adminServices.getMentors(
                pageNumber,
                limitNumber,
            )

            return res.status(200).send({
                message: 'Mentors Got It Successfully',
                success: true,
                result: response
            });

        } catch (error) {
            console.log(error)
        }
    }

    async blockMentor(req: Request, res: Response): Promise<any> {
        try {
            const id = req.query.mentorId
            const response = await this.adminServices.blockMentor(String(id))
            if (response) {
                return res
                    .status(200)
                    .send({
                        mentor: response,
                        message: `${response.username} Mentor Blocked`,
                        success: true
                    })
            }
        } catch (error) {
            console.log(error)
        }
    }


    async unBlockMentor(req: Request, res: Response): Promise<any> {
        try {
            const id = req.query.mentorId
            const response = await this.adminServices.unBlockMentor(String(id))
            if (response) {
                return res
                    .status(200)
                    .send({
                        mentor: response,
                        message: `${response.username} Mentor UnBlocked`,
                        success: true
                    })
            }
        } catch (error) {
            console.log(error)
        }
    }



    async blockUser(req: Request, res: Response): Promise<any> {
        try {
            const id = req.query.userId
            const response = await this.adminServices.blockUser(String(id))
            if (response) {
                return res
                    .status(200)
                    .send({
                        mentor: response,
                        message: `${response.username} User Blocked`,
                        success: true
                    })
            }
        } catch (error) {
            console.log(error)
        }
    }


    async unBlockUser(req: Request, res: Response): Promise<any> {
        try {
            const id = req.query.userId
            const response = await this.adminServices.unBlockUser(String(id))
            if (response) {
                return res
                    .status(200)
                    .send({
                        mentor: response,
                        message: `${response.username} User UnBlocked`,
                        success: true
                    })
            }
        } catch (error) {
            console.log(error)
        }
    }


    /*-------------------------------------- WEEK - 2 ---------------------------------*/
    async addCategory(req: Request, res: Response): Promise<any> {
        try {
            const { categoryName } = req.body
            const data = categoryName
            const response = await this.adminServices.addCategory(data)

            if (response) {
                return res
                    .status(200)
                    .send({
                        message: 'Category Added',
                        status: true,
                        data: response
                    })
            }

        } catch (error: any) {
            // console.log(error)
            if (error.name === 'categoryAlreadyExist') {
                return res
                    .status(403)
                    .send({
                        message: 'Category Already Exist',
                        success: false
                    })
            }
        }
    }

    async editCategory(req: Request, res: Response): Promise<any> {
        try {
            const { categoryId } = req.query
            const { categoryName } = req.body

            const response = await this.adminServices.editCategory(categoryName, String(categoryId))

            if (response === 'Already Exist') {
                return res
                    .status(403)
                    .send({
                        message: 'Category Already Exist',
                        status: false,
                    })
            }

            if (response) {
                return res
                    .status(200)
                    .send({
                        message: 'Category Edited',
                        status: true,
                        data: response
                    })
            }

        } catch (error: any) {
            if (error && error.name === 'CategoryAlreadyExistsError') {
                return res
                    .status(403)
                    .send({
                        message: 'Already Exist',
                        success: false
                    })
            }
        }
    }


    async unListCategory(req: Request, res: Response): Promise<any> {
        try {
            const { categoryId } = req.query
            const response = await this.adminServices.unListCategory(String(categoryId))
            return res
                .status(200)
                .send({
                    message: "Category UnListed",
                    success: true,
                    data: response
                })
        } catch (error: any) {
            return res.status(500).send({
                message: 'Internal Server Error',
                success: false,
            });
        }
    }



    async listCategory(req: Request, res: Response): Promise<any> {
        try {
            const { categoryId } = req.query
            const response = await this.adminServices.listCategory(String(categoryId))
            return res
                .status(200)
                .send({
                    message: "Category Listed",
                    success: true,
                    data: response
                })
        } catch (error: any) {
            return res.status(500).send({
                message: 'Internal Server Error',
                success: false,
            });
        }
    }

    async getAllCategory(req: Request, res: Response): Promise<any> {
        try {

            const { page = 1, limit = 4 } = req.query;

            const pageNumber = parseInt(page as string, 10);
            const limitNumber = parseInt(limit as string, 10);

            if (pageNumber < 1 || limitNumber < 1) {
                return res
                    .status(400)
                    .send({
                        message: 'Invalid page or limit value',
                        success: false,
                    });
            }

            const response = await this.adminServices.getAllCategory(
                pageNumber,
                limitNumber,
            )

            return res.status(200).send({
                message: 'Categories Got It Successfully',
                success: true,
                result: response
            });

        } catch (error) {
            return res.status(500).send({
                message: 'Internal Server Error',
                success: false,
            });
        }
    }

//Course
    async getAllCourse(req: Request, res: Response): Promise<any> {
        try {
            const { page = 1, limit = 4 } = req.query;

            const pageNumber = parseInt(page as string, 10);
            const limitNumber = parseInt(limit as string, 10);

            if (pageNumber < 1 || limitNumber < 1) {
                return res
                    .status(400)
                    .send({
                        message: 'Invalid page or limit value',
                        success: false,
                    });
            }

            const response = await this.adminServices.getAllCourse(
                pageNumber,
                limitNumber,
            )

            return res.status(200).send({
                message: 'Courses Got It Successfully',
                success: true,
                result: response
            });

        } catch (error: any) {
            return res.status(500).send({
                message: 'Internal Server Error',
                success: false,
            });
        }
    }


    async unListCourse(req: Request, res: Response): Promise<any> {
        try {
            const { courseId } = req.query
            const response = await this.adminServices.unListCourse(String(courseId))
            return res
                .status(200)
                .send({
                    message: 'Course Unlisted',
                    success: true
                })
        } catch (error: any) {
            return res.status(500).send({
                message: 'Internal Server Error',
                success: false,
            });
        }
    }


    async listCourse(req: Request, res: Response): Promise<any> {
        try {
            const { courseId } = req.query
            const response = await this.adminServices.listCourse(String(courseId))
            return res
                .status(200)
                .send({
                    message: 'Course Listed',
                    success: true
                })
        } catch (error: any) {
            return res.status(500).send({
                message: 'Internal Server Error',
                success: false,
            });
        }
    }

    async adminNonApprovedCourse(req: Request, res: Response): Promise<any> {
        try {
            const { page = 1, limit = 1 } = req.query

            const pageNumber = parseInt(page as string, 10);
            const limitNumber = parseInt(limit as string, 10);

            const getNotApprovedCourse = await this.adminServices.adminNonApprovedCourse(pageNumber, limitNumber)

            return res.status(200).send({
                message: 'Not Approved Course Got It',
                success: true,
                result: getNotApprovedCourse
            })
        } catch (error: any) {
            return res.status(500).send({
                message: 'Internal Server Error',
                success: false,
            });
        }
    }

    async adminNonApprovedCourseDetails(req: Request, res: Response): Promise<any> {
        try {
            const { courseId } = req.query
            const getDetails = await this.adminServices.adminNonApprovedCourseDetails(String(courseId))
            return res.status(200).send({
                message: 'Course Details Got It',
                success: true,
                result: getDetails
            })
        } catch (error: any) {
            return res.status(500).send({
                message: 'Internal Server Error',
                success: false,
            });
        }
    }

    async adminApproveCourse(req: Request, res: Response): Promise<any> {
        try {
            const { courseId } = req.query
            const approveIt = await this.adminServices.adminApproveCourse(String(courseId))
            return res.status(200).send({
                message: 'Course Approved',
                success: true,
                result: approveIt
            })
        } catch (error: any) {
            return res.status(500).send({
                message: 'Internal Server Error',
                success: false,
            });
        }
    }


    async getWallet(req: Request, res: Response): Promise<any> {
        try {
            const { page = 1, limit = 4 } = req.query;

            const pageNumber = parseInt(page as string, 10);
            const limitNumber = parseInt(limit as string, 10);

            if (pageNumber < 1 || limitNumber < 1) {
                const error = new Error('Invalid page or limit value')
                error.name = 'Invalid page or limit value'
                throw error
            }

            // const userId = await getId('accessToken', req)
            const adminId = 'admin'

            const response = await this.adminServices.getWallet(adminId, pageNumber, limitNumber)

            return res
                .status(200)
                .send({
                    message: 'Admin Wallet Got It',
                    success: true,
                    data: response
                })
        } catch (error: any) {
            console.info('wallet ',error)
            return res.status(500).send({
                message: 'Internal Server Error',
                success: false,
            });
        }
    }


//Badge
    async addBadge(req: Request, res: Response): Promise<any> {
        try {
            const { badgeName, description, value } = req.body
            const badge = new BadgeManagementModel({
                badgeName,
                description,
                value
            })
            const savedBadge = await badge.save()
            return res
                .status(200)
                .send({
                    message: 'Badge Saved',
                    success: true,
                    data: savedBadge
                })
        } catch (error: any) {
            return res.status(500).send({
                message: 'Internal Server Error',
                success: false,
            });
        }
    }


    async getBadges(req: Request, res: Response): Promise<any> {
        try {
            const { page = 1, limit = 4 } = req.query;
            const pageNumber = parseInt(page as string, 10);
            const limitNumber = parseInt(limit as string, 10);

            const skip = (pageNumber - 1) * limitNumber;

            const response = await BadgeManagementModel
                .find()
                .skip(skip)
                .limit(limitNumber)
                .sort({ createdAt: -1 });

            const totalCourses = await BadgeManagementModel.countDocuments();

            const data = {
                badges: response,
                currentPage: page,
                totalPages: Math.ceil(totalCourses / limitNumber),
                totalCourses: totalCourses
            };
            return res
                .status(200)
                .send({
                    message: 'Badges All Got It',
                    success: true,
                    result: data
                })

        } catch (error: any) {
            return res.status(500).send({
                message: 'Internal Server Error',
                success: false,
            });
        }
    }



    async editBadge(req: Request, res: Response): Promise<any> {
        try {
            const { badgeId } = req.params
            const { badgeName, description, value } = req.body
            const data = { badgeName, description, value }
            const findBadge = await BadgeManagementModel.findByIdAndUpdate(
                badgeId,
                data,
                { new: true }
            )
            return res
                .status(200)
                .send({
                    message: 'Badge Saved',
                    success: true,
                    data: findBadge
                })
        } catch (error: any) {
            return res.status(500).send({
                message: 'Internal Server Error',
                success: false,
            });
        }
    }


    ////////////////////////////////// WEEK - 4 ///////////////////////////////////


    async adminDashboard(req: Request, res: Response): Promise<any> {
        try {
            const getDashboard = await this.adminServices.adminDashboard()
            return res.status(200).send({
                message: 'Dashboard Details Got It',
                success: true,
                result: getDashboard
            })
        } catch (error: any) {
            console.info('dash ',error)
            return res.status(500).send({
                message: 'Internal Server Error',
                success: false,
            });
        }
    }


    async adminChartGraph(req: Request, res: Response): Promise<any> {
        try {
            const filters = req.query.filter ? JSON.parse(req.query.filter as string) : {};
            const getChat = await this.adminServices.adminChartGraph(filters)
            return res.status(200).send({
                message: 'Chart Graph Details Got It',
                success: true,
                result: getChat
            })
        } catch (error: any) {
            return res.status(500).send({
                message: 'Internal Server Error',
                success: false,
            });
        }
    }

    async adminSalesReport(req: Request, res: Response): Promise<any> {
        try {
            const filters = req.query.filter ? JSON.parse(req.query.filter as string) : {};
            const getReport = await this.adminServices.adminSalesReport(filters)
            return res.status(200).send({
                message: 'Report Details Got It',
                success: true,
                result: getReport
            })
        } catch (error: any) {
            return res.status(500).send({
                message: 'Internal Server Error',
                success: false,
            });
        }
    }

 


}