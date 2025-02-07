import { IAdminWallet } from "../../models/adminWallet.model"
import { ICategory } from "../../models/categroy.model"
import { IMentor } from "../../models/mentor.model"
import { ICourse } from "../../models/uploadCourse.model"
import { IUser } from "../../models/user.model"

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
     adminGetWallet(page: number, limit: number, adminId: string): Promise<IAdminWallet | null>

     ////////////////////////////////// WEEK - 3 //////////////////////////
     adminNonApprovedCourse(page: number, limit: number): Promise<any>
     adminNonApprovedCourseDetails(): Promise<any>
     adminDashboard(): Promise<any>
     adminChartGraph(): Promise<any>
     adminSalesReport(): Promise<any>
     
}