import { Model, Document } from "mongoose"
import { IMentor } from "../../models/mentor.model"
import { IUser } from "../../models/user.model"

export class AdminBaseRepository<T extends Document> {
    private model: Model<T>

    constructor(model: Model<T>) {
        this.model = model
    }

    async getUsers(page: number = 1, limit: number = 4): Promise<any> {
        try {
            const skip = (page - 1) * limit;

            const response = await this.model
                .find()
                .skip(skip)
                .limit(limit)
                .sort({ createdAt: -1 });

            const totalCourses = await this.model.countDocuments();

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
        } catch (error) {
            console.log(error)
        }
    }

    
    async getMentors(page: number = 1, limit: number = 4): Promise<any> {
        try {
            const skip = (page - 1) * limit;

            const response = await this.model
                .find()
                .skip(skip)
                .limit(limit)
                .sort({ createdAt: -1 });

            const totalCourses = await this.model.countDocuments();

            if (!response || response.length === 0) {
                const error = new Error('Mentors Not Found');
                error.name = 'MentorssNotFound';
                throw error;
            }

            return {
                courses: response,
                currentPage: page,
                totalPages: Math.ceil(totalCourses / limit),
                totalCourses: totalCourses
            };
        } catch (error) {
            console.log(error)
        }
    }

    async blockMentor(id: string): Promise<any> {
        try {
            // Find the mentor by ID
            const mentor = await this.model.findById(id).exec();

            // Check if the mentor exists
            if (!mentor) {
                throw new Error('Mentor not found');
            }

            const mentorToUpdate = mentor as unknown as IMentor;

            // Update the `isBlocked` field
            mentorToUpdate.isBlocked = true;

            // Save the updated mentor document
            const updatedMentor = await mentor.save();

            // Return the updated mentor
            return updatedMentor as unknown as IMentor;

        } catch (error) {
            // Log the error and rethrow it for further handling
            console.error('Error blocking mentor:', error);
            throw new Error('Failed to block mentor');
        }
    }

    async unBlockMentor(id: string): Promise<any> {
        try {
            const mentor = await this.model.findById(id).exec();

            if (!mentor) {
                throw new Error('Mentor not found');
            }

            const mentorToUpdate = mentor as unknown as IMentor;

            mentorToUpdate.isBlocked = false;

            const updatedMentor = await mentor.save();

            return updatedMentor as unknown as IMentor;

        } catch (error) {
            console.error('Error Unblocking mentor:', error);
            throw new Error('Failed to Unblock mentor');
        }
    }



    async blockUser(id: string): Promise<any> {
        try {
            const updatedUser = await this.model.findByIdAndUpdate(
                id,
                { isBlocked: true },
                { new: true } // Return the updated document
            ).exec();

            if (!updatedUser) {
                throw new Error('User not found');
            }

            return updatedUser as unknown as IUser;
        } catch (error) {
            console.error('Error blocking User:', error);
            throw new Error('Failed to block User');
        }
    }

    async unBlockUser(id: string): Promise<any> {
        try {
            const updatedUser = await this.model.findByIdAndUpdate(
                id,
                { isBlocked: false },
                { new: true } // Return the updated document
            ).exec();

            if (!updatedUser) {
                throw new Error('User not found');
            }

            return updatedUser as unknown as IUser;
        } catch (error) {
            console.error('Error Unblocking User:', error);
            throw new Error('Failed to Unblock User');
        }
    }


    /* ---------------------------------- WEEK - 2 ----------------------------*/

    async addCategory(data: string): Promise<any> {
        try {
            const isExist = await this.model.findOne({ categoryName: data })
            if (isExist) {
                const error = new Error('Category Already Exist')
                error.name = 'categoryAlreadyExist'
                throw error
            }
            const categoryData = {
                categoryName: data
            }
            const document = new this.model(categoryData)
            const savedCategory = await document.save()

            return savedCategory
        } catch (error) {
            throw error
        }
    }


    async editCategory(categoryName: string, categoryId: string): Promise<any> {
        try {
            const isExist = await this.model.findOne({
                categoryName: categoryName,
                _id: { $ne: categoryId },
            });
    
            if (isExist) {
                const error = new Error("Category Already Exists");
                error.name = "CategoryAlreadyExistsError";
                throw error;
            }
    
            const updatedCategory = await this.model.findByIdAndUpdate(
                categoryId,
                { $set: { categoryName: categoryName } },
                { new: true } // Specify options outside the update object
            );
    
            if (!updatedCategory) {
                const error = new Error("Category Not Found");
                error.name = "CategoryNotFoundError";
                throw error;
            }
    
            return updatedCategory;
        } catch (error) {
            throw error; // Ensure errors are rethrown for higher-level handling
        }
    }


    async unListCategory(categoryId: string): Promise<any> {
        try{
            const unListedCategory = await this.model.findByIdAndUpdate(
                categoryId,
                {isListed: false},
                {new: true}
            )
            return unListedCategory
        }catch(error: any){
            throw error
        }
    }


    async listCategory(categoryId: string): Promise<any> {
        try{
            const unListedCategory = await this.model.findByIdAndUpdate(
                categoryId,
                {isListed: true},
                {new: true}
            )
            return unListedCategory
        }catch(error: any){
            throw error
        }
    }




    async getAllCategory(page: number = 1, limit: number = 3): Promise<any> {
        try{
            const skip = (page - 1) * limit;

            const response = await this.model
                .find()
                .skip(skip)
                .limit(limit)
                .sort({ createdAt: -1 });

            const totalCourses = await this.model.countDocuments();

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
        }catch(error){
            console.log(error)
        }
    }

    async getAllCourse(page: number = 1, limit: number = 5): Promise<any> {
        try{
            const skip = (page - 1) * limit;

            const response = await this.model
                .find()
                .skip(skip)
                .limit(limit)
                .sort({ createdAt: -1 });

            const totalCourses = await this.model.countDocuments();

            if (!response || response.length === 0) {
                const error = new Error('Course Not Found');
                error.name = 'CoursesNotFound';
                throw error;
            }

            return {
                courses: response,
                currentPage: page,
                totalPages: Math.ceil(totalCourses / limit),
                totalCourses: totalCourses
            };
        }catch(error: any){
            throw error
        }
    }


    async unListCourse(courseId: string): Promise<any> {
        try{
            const updatedCourse = await this.model.findByIdAndUpdate(
                courseId,
                {isListed: false},
                {new: true}
            )

            const getAllCourse = await this.model.find()

            return getAllCourse
            
        }catch(error: any){
            throw error
        }
    }


    async listCourse(courseId: string): Promise<any> {
        try{
            const updatedCourse = await this.model.findByIdAndUpdate(
                courseId,
                {isListed: true},
                {new: true}
            )
            const getAllCourse = await this.model.find()
            return getAllCourse
        }catch(error: any){
            throw error
        }
    }

}
