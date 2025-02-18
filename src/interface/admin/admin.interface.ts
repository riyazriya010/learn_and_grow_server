import { IBadgeManagement } from "../../models/adminBadge.model"
import { IAdminWallet } from "../../models/adminWallet.model"
import { ICategory } from "../../models/categroy.model"
import { IMentor } from "../../models/mentor.model"
import { ICourse } from "../../models/uploadCourse.model"
import { IUser } from "../../models/user.model"



export interface IAdminStudentMethods {
     // adminLogin(email: string, password: string): Promise<void>
     adminGetStudents(page: number, limit: number): Promise<IUser[] | null>
     adminBlockStudent(studentId: string): Promise<IUser | null>
     adminUnBlockStudent(studentId: string): Promise<IUser | null>
}

export interface IAdminMentorMethods {
     adminGetMentors(page: number, limit: number): Promise<IMentor[] | null>
     adminBlockMentor(studentId: string): Promise<IMentor | null>
     adminUnBlockMentor(studentId: string): Promise<IMentor | null>
}

export interface IAdminCourseMethods {
     adminGetAllCourse(page: number, limit: number): Promise<ICourse[] | null>
     adminListCourse(courseId: string): Promise<ICourse | null>
     adminUnListCourse(courseId: string): Promise<ICourse | null>
     adminNonApprovedCourse(page: number, limit: number): Promise<any>
     adminNonApprovedCourseDetails(courseId: string): Promise<any>
     adminGetWallet(adminId: string, page: number, limit: number, ): Promise<IAdminWallet | null>
     adminApproveCourse(courseId: string): Promise<any>
}

export interface IAdminCategoryMethods {
     adminAddCategory(categoryName: string): Promise<ICategory | null>
     adminEditCategory(categoryId: string, categoryName: string): Promise<ICategory | null>
     adminGetAllCategory(page: number, limit: number): Promise<ICategory[] | null>
     adminListCategory(categoryId: string): Promise<ICategory | null>
     adminUnListCategory(categoryId: string): Promise<ICategory | null>
}

export interface IAdminBadgeMethods {
     adminAddBadge(data:  {badgeName: string, description: string, value: string}): Promise<IBadgeManagement |null>
     adminEditBadge(badgeId: string, data: {badgeName: string, description: string, value: string}): Promise<IBadgeManagement | null>
     adminGetBadges(page: number, limit: number): Promise<any | null>
}

export interface IAdminSalesMethods {
     adminDashboard(): Promise<any>
     adminChartGraph(filters: any): Promise<any>
     adminSalesReport(filters: any): Promise<any>
}


export interface IAdminMethods {
     ///////////////////////// WEEK - 1 /////////////////////
     adminLogin(email: string, password: string): Promise<void>
     adminGetStudents(page: number, limit: number): Promise<IUser[] | null>
     adminBlockStudent(studentId: string): Promise<IUser | null>
     adminUnBlockStudent(studentId: string): Promise<IUser | null>
     adminGetMentors(page: number, limit: number): Promise<IMentor[] | null>
     adminBlockMentor(studentId: string): Promise<IMentor | null>
     adminUnBlockMentor(studentId: string): Promise<IMentor | null>

     /////////////////////////// WEEK - 2 ///////////////////////
     adminAddCategory(categoryName: string): Promise<ICategory | null>
     adminEditCategory(categoryId: string, categoryName: string): Promise<ICategory | null>
     adminGetAllCategory(page: number, limit: number): Promise<ICategory[] | null>
     adminListCategory(categoryId: string): Promise<ICategory | null>
     adminUnListCategory(categoryId: string): Promise<ICategory | null>

     adminGetAllCourse(page: number, limit: number): Promise<ICourse[] | null>
     adminListCourse(courseId: string): Promise<ICourse | null>
     adminUnListCourse(courseId: string): Promise<ICourse | null>
     adminNonApprovedCourse(page: number, limit: number): Promise<any>
     adminNonApprovedCourseDetails(): Promise<any>
     adminGetWallet(page: number, limit: number, adminId: string): Promise<IAdminWallet | null>

     ////////////////////////////////// WEEK - 3 //////////////////////////

     adminDashboard(): Promise<any>
     adminChartGraph(): Promise<any>
     adminSalesReport(): Promise<any>

}


