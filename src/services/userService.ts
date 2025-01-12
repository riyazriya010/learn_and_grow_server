import { studentLoginData } from "../interface/userDto"
import { IUser } from "../models/user.model"
import UserRepositories from "../repositories/userRepository"


export default class UserServices {
    private userRepositories: UserRepositories
    constructor() {
        this.userRepositories = new UserRepositories()
    }

    //new

    public async studentSignup(data: studentLoginData): Promise<IUser | null | any> {
        try {
            const addStudent = await this.userRepositories.studentSignup(data)
            return addStudent
        } catch (error: unknown) {
            if (error instanceof Error) {
                if (error.name === 'UserAlreadyExit') {
                    throw error
                }
            }
            throw error
        }
    }

    public async studentGoogleSignIn(email: string, displayName: string): Promise<IUser | null> {
        try {
            const addStudent = await this.userRepositories.studentGoogleSignIn(email, displayName)
            return addStudent
        } catch (error: unknown) {
            if (error instanceof Error) {
                if (error.name === 'UserAlreadyExit') {
                    throw error
                }
            }
            throw error
        }
    }

    public async studentGoogleLogin(email: string): Promise<IUser | null> {
        try {
            const addStudent = await this.userRepositories.studentGoogleLogin(email)
            return addStudent
        } catch (error: unknown) {
            if (error instanceof Error) {
                if (error.name === 'UserNotFound' || error.name === 'UserBlocked') {
                    throw error;
                }
            }
            throw error
        }
    }

    public async studentLogin(email: string, password: string): Promise<IUser | null> {
        const loggedUser = await this.userRepositories.studentLogin(email, password)
        return loggedUser
    }

    public async verifyUser(email: string): Promise<IUser | null> {
        const response = await this.userRepositories.verifyUser(email)
        return response
    }

    public async forgetPassword(data: any): Promise<IUser | null | any> {
        const response = await this.userRepositories.forgetPassword(data)
        return response
    }

    public async checkStudent(id: string): Promise<any> {
        const response = await this.userRepositories.checkStudent(id)
        return response
    }

    public async studentReVerify(email: string): Promise<any> {
        const response = await this.userRepositories.studentReVerify(email)
        return response
    }

    public async isUserBlocked(email: string): Promise<boolean> {
        const response = await this.userRepositories.isUserBlocked(email)
        return response
    }

    public async profileUpdate(id: string, data: any): Promise<any> {
        const response = await this.userRepositories.profileUpdate(id, data)
        return response
    }


    /* ------------------------------ WEEK -2 -------------------------*/

    public async getAllCourses(page: number, limit: number): Promise<any> {
        try {
            // Call the repository to get the courses with pagination
            const response = await this.userRepositories.getAllCourses(page, limit);
            return response;
        } catch (error: any) {
            throw error;
        }
    }


    public async getCourse(id: string): Promise<any> {
        try {
            const response = await this.userRepositories.getCourse(id)
            return response
        } catch (error: any) {
            throw error
        }
    }

    public async getCoursePlay(id: string): Promise<any> {
        try {
            const response = await this.userRepositories.getCoursePlay(id)
            return response
        } catch (error: any) {
            throw error
        }
    }

    public async filterData(page: number, limit: number, selectedCategory: string, selectedLevel: string, searchTerm: string): Promise<any> {
        try {
            const response = await this.userRepositories.filterData(
                page,
                limit,
                String(selectedCategory),
                String(selectedLevel),
                String(searchTerm)
            )
            return response
        } catch (error: any) {
            throw error
        }
    }


    public async findCourseById(courseId: string, amount: number, courseName: string): Promise<any> {
        try {
            const response = await this.userRepositories.findCourseById(courseId, amount, courseName)
            return response
        } catch (error: any) {
            throw error
        }
    }

    public async findChaptersById(courseId: string): Promise<any> {
        try {
            const response = await this.userRepositories.findChaptersById(courseId)
            return response
        } catch (error: any) {
            throw error
        }
    }


    public async buyCourse(userId: string, courseId: string, chapters: any, txnid: string): Promise<any> {
        try {
            const response = await this.userRepositories.buyCourse(userId, courseId, chapters, txnid)
            return response
        } catch (error: any) {
            throw error
        }
    }

    public async getBuyedCourses(userId: string, page: number, limit: number): Promise<any> {
        try {
            const response = await this.userRepositories.getBuyedCourses(userId, page, limit)
            return response
        } catch (error: any) {
            throw error
        }
    }

    public async coursePlay(buyedId: string): Promise<any> {
        try {
            const response = await this.userRepositories.coursePlay(buyedId)
            return response
        } catch (error: any) {
            throw error
        }
    }


    public async chapterVideoEnd(chapterId: string): Promise<any> {
        try {
            const response = await this.userRepositories.chapterVideoEnd(chapterId)
            return response
        } catch (error: any) {
            throw error
        }
    }


    public async getCertificate(certificateId: string): Promise<any> {
        try {
            const response = await this.userRepositories.getCertificate(certificateId)
            return response
        } catch (error: any) {
            throw error
        }
    }

    public async getQuizz(courseId: string): Promise<any> {
        try {
            const response = await this.userRepositories.getQuizz(courseId)
            return response
        } catch (error: any) {
            throw error
        }
    }

    public async completeCourse(userId: string, courseId: string): Promise<any> {
        try {
            const response = await this.userRepositories.completeCourse(userId, courseId)
            return response
        } catch (error: any) {
            throw error
        }
    }


    public async createCertificate(data: any): Promise<any> {
        try {
            const response = await this.userRepositories.createCertificate(data)
            return response
        } catch (error: any) {
            throw error
        }
    }


    public async getCertificates(): Promise<any> {
        try {
            const response = await this.userRepositories.getCertificates()
            return response
        } catch (error: any) {
            throw error
        }
    }
}

