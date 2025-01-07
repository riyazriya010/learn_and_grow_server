import { Document, Model } from "mongoose"
import { IMentor } from "../../models/mentor.model"
import { mentorSignUpData } from "../../interface/mentor.type"
import Mail from "../../integration/nodemailer"
import { generateAccessToken } from "../../integration/mailToken"
import bcrypt from 'bcrypt'
import { IQuiz } from "../../models/quizz.model"
import mongoose from "mongoose"
import { CourseModel, ICourse } from "../../models/uploadCourse.model"


export default class MentorBaseRepository<T extends Document> {
    private model: Model<T>
    private courseModel: Model<ICourse> = CourseModel as Model<ICourse>;

    constructor(model: Model<T>) {
        this.model = model
    }

    async findByEmail(email: string): Promise<IMentor | null> {
        return await this.model.findOne({ email: email })
    }

    async mentorSignUp(data: mentorSignUpData): Promise<IMentor | null> {
        try {
            const modifiedData = { ...data, role: 'mentor' }
            const document = new this.model(modifiedData)
            const savedUser = await document.save()

            const mail = new Mail()
            const token = await generateAccessToken({ id: savedUser.id, email: data.email })
            const portLink = process.env.MENTOR_PORT_LINK
            if (!portLink) {
                throw new Error('PORT_LINK environment variable is not set');
            }
            const createdLink = `${portLink}?token=${token}`
            mail.sendMentorVerificationEmail(data.email, createdLink)
                .then(info => {
                    console.log('Verification email sent successfully:');
                })
                .catch(error => {
                    console.error('Failed to send verification email:', error);
                });

            return savedUser as unknown as IMentor

        } catch (error: any) {
            console.log(error.message)
            return null
        }
    }

    async mentorLogin(email: string, password: string): Promise<IMentor | null> {

        try {
            const getUser = await this.model.findOne({ email: email }).lean<IMentor>().exec();

            if (!getUser) {
                return null
            }
            const isPassword = await bcrypt.compare(password, getUser.password)

            if (!isPassword) {
                return null
            }

            return getUser
        } catch (error) {
            console.log(error)
            return null
        }

    }


    async forgetPassword(data: any): Promise<any> {
        try {
            const { email, password } = data

            const isUser = await this.model.findOne({ email: email }).exec()

            if (!isUser) {
                return null
            }
            const user = isUser as unknown as IMentor

            const hashedPassword = await bcrypt.hash(password, 10)
            user.password = hashedPassword

            const updatedUser = await user.save()

            return updatedUser
        } catch (error) {
            console.log(error)
        }
    }


    async mentorGoogleLogin(email: string): Promise<IMentor | null> {
        const response = await this.model.findOne({ email: email })
        return response as unknown as IMentor
    }


    async mentorGoogleSignUp(email: string, displayName: string): Promise<IMentor | null> {
        const mentorData = {
            username: displayName,
            email,
            phone: 'Not Provided',
            expertise: 'Not Provided',
            skills: 'Not Provided',
            password: 'null',
            role: 'mentor',
            isVerified: true
        }

        const document = new this.model(mentorData)
        const savedUser = await document.save()

        return savedUser as unknown as IMentor
    }

    async profileUpdate(id: string, data: any): Promise<any> {
        try {
            const { username, phone, profilePicUrl } = data;
            // Prepare data to update
            const updateData: any = {
                username,
                phone,
            };

            // Only add profilePicUrl to the updateData if it exists
            if (profilePicUrl) {
                updateData.profilePicUrl = profilePicUrl;
            }

            // Perform the update
            const response = await this.model.findByIdAndUpdate(id, updateData, { new: true });
            return response
        } catch (error) {
            console.log(error)
        }
    }

    async checkStudent(id: string): Promise<any> {
        try {
            const response = await this.model.findById(id)
            const user = response as unknown as IMentor
            return user
        } catch (error) {
            console.log(error)
        }
    }

    async isUserBlocked(email: string): Promise<any> {
        try {
            const response = await this.model.findOne({ email: email })
            const user = response as unknown as IMentor
            if (user.isBlocked) {
                return true
            }
            return false
        } catch (error) {
            console.log(error)
        }
    }


    async verifyMentor(email: string): Promise<IMentor | null> {

        const findMentor = await this.model.findOne({ email: email }).exec()

        if (!findMentor) {
            console.error('Mentor not found:', email); // Debug log
            return null;
        }

        console.log('Found Mentor before update:', findMentor); // Debug log

        const mentor = findMentor as unknown as IMentor;

        // Update the user verification status
        mentor.isVerified = true;

        // Save the updated document
        const updatedMentor = await mentor.save();
        console.log('Updated Mentor after verification:', updatedMentor)

        return updatedMentor;
    }




    async mentorReVerify(email: string): Promise<any> {
        try {
            const userData = await this.model.findOne({ email: email })
            if (!userData) {
                return null
            }
            const token = await generateAccessToken({ id: userData.id, email: email })
            const portLink = process.env.MENTOR_PORT_LINK
            if (!portLink) {
                throw new Error('PORT_LINK environment variable is not set');
            }
            const createdLink = `${portLink}?token=${token}`
            const mail = new Mail()
            mail.sendMentorVerificationEmail(email, createdLink)
                .then(info => {
                    console.log('Verification email sent successfully:');
                })
                .catch(error => {
                    console.error('Failed to send verification email:', error);
                });
            return userData as unknown as IMentor
        } catch (error) {
            console.log(error)
        }
    }

    async isBlocked(id: string): Promise<any> {
        try {
            const response = await this.model.findById(id)
            const user = response as unknown as IMentor
            if (user.isBlocked) {
                return true
            }
            return false
        } catch (error) {
            console.log(error)
        }
    }

    async isVerified(id: string): Promise<any> {
        try {
            const response = await this.model.findById(id)
            const user = response as unknown as IMentor
            if (user.isVerified) {
                return true
            }
            return false
        } catch (error) {
            console.log(error)
        }
    }


    /*------------------------------- WEEK -2 -------------------------*/


    public async addCourse(data: any): Promise<any> {
        try{
            const response = await this.model.create(data);
            return response
        }catch(error: any){
            throw error
        }
    }

    public async editCourse(courseId: string, updatedFields: any): Promise<any> {
        try{
            const response = await this.model.findByIdAndUpdate(
                courseId,
                updatedFields,
                { new: true }
            )
            return response
        }catch(error: any){
            throw error
        }
    }

    async unPublishCourse(courseId: string): Promise<any> {
        try {
            console.log('men base repo: ', courseId)
            const updatedCourse = await this.model.findByIdAndUpdate(
                courseId,
                { isPublished: false },
                { new: true }
            )
            console.log('upd ', updatedCourse)
            if (!updatedCourse) {
                return
            }
            return updatedCourse
        } catch (error: any) {
            throw error
        }
    }



    async publishCourse(courseId: string): Promise<any> {
        try {
            const updatedCourse = await this.model.findByIdAndUpdate(
                courseId,
                { isPublished: true },
                { new: true }
            )
            if (!updatedCourse) {
                return
            }
            return updatedCourse
        } catch (error: any) {
            throw error
        }
    }



    async filterCourse(page: number = 1, limit: number = 4, searchTerm: string): Promise<any> {
        try {

            console.log('filters: ', searchTerm);

            const skip = (page - 1) * limit;

            const query: any = {};
            if (searchTerm !== 'undefined') {
                query.courseName = { $regex: searchTerm, $options: 'i' };
            }

            const courses = await this.model.find(query).skip(skip).limit(limit).sort({ createdAt: -1 })

            const totalCourses = await this.model.countDocuments(query);

            if (!courses || courses.length === 0) {
                const error = new Error('Course Not Found')
                error.name = 'CourseNotFound'
                throw error
            }

            return {
                courses,
                currentPage: page,
                totalPages: Math.ceil(totalCourses / limit),
                totalCourses,
            };

        } catch (error: any) {
            throw error;
        }
    }



    async getAllCourses(page: number = 1, limit: number = 4): Promise<any> {
        try {

            const skip = (page - 1) * limit;

            const response = await this.model
                .find()
                .skip(skip)
                .limit(limit)
                .sort({ createdAt: -1 });

            const totalCourses = await this.model.countDocuments();

            if (!response || response.length === 0) {
                const error = new Error('Courses Not Found');
                error.name = 'CoursesNotFound';
                throw error;
            }

            return {
                courses: response,
                currentPage: page,
                totalPages: Math.ceil(totalCourses / limit),
                totalCourses: totalCourses
            };

            // const response = await this.model.find().sort({ createdAt: -1 }).exec()
            // return response
        } catch (error) {
            console.log(error)
        }
    }


    async getCourse(courseId: string): Promise<any> {
        try {
            const response = await this.model.findById(courseId)
            return response
        } catch (error: any) {
            throw error
        }
    }


    async getAllCategory(): Promise<any> {
        try {
            const response = await this.model.find()
            return response
        } catch (error: any) {
            throw error
        }
    }


    async editChapter(
        title: string,
        description: string,
        chapterId: string,
        location?: string
    ): Promise<any> {
        try {

            // Validate input
            if (!title || !description || !chapterId) {
                throw new Error("Title, description, and chapterId are required");
            }

            const data: Record<string, any> = {
                chapterTitle: title,
                description,
            };

            if (location) {
                data.videoUrl = location;
            }

            const updatedChapter = await this.model.findByIdAndUpdate(
                chapterId,
                { $set: data },
                { new: true }
            );

            if (!updatedChapter) {
                throw new Error("Chapter not found");
            }

            const updatedCourse = await this.courseModel.updateOne(
                { "fullVideo.chapterId": chapterId },
                { $set: { "fullVideo.$[elem].chapterId": updatedChapter._id } },
                { arrayFilters: [{ "elem.chapterId": chapterId }] }
            );

            if (!updatedCourse || updatedCourse.modifiedCount === 0) {
                console.warn("No course updated for the given chapterId");
            }

            return updatedChapter;

        } catch (error: any) {
            console.error("Error updating chapter:", error.message);
            throw error;
        }
    }


    async getAllChapters(courseId: string): Promise<any> {
        try {
            const response = await this.model.find({
                courseId: courseId
            })
            return response
        } catch (error: any) {
            throw error
        }
    }

    async addQuizz(data: { question: string; option1: string; option2: string; correctAnswer: string }, courseId: string): Promise<any> {
        try {
            const findQuizz = await this.model.findOne({ courseId: courseId }) as IQuiz;

            const questionData = {
                question: data.question,
                options: [data.option1, data.option2],
                correct_answer: data.correctAnswer,
            };

            const questionExist = findQuizz?.questions.some(q => q.question === data.question);

            if (questionExist) {
                const error = new Error('Question Already Exist')
                error.name = 'QuestionAlreadyExist'
                throw error
            }

            if (findQuizz) {
                // If quiz exists for the course, push the new question into the questions array
                findQuizz.questions.push(questionData);
                await findQuizz.save();
                return findQuizz;
            } else {
                // If no quiz exists for the course, create a new quiz document
                const newQuizz = await this.model.create({ courseId: courseId, questions: [questionData] });
                return newQuizz;
            }
        } catch (error: any) {
            // console.error('Error in base repository layer:', error);
            throw error;
        }
    }


    async getAllQuizz(courseId: string): Promise<any> {
        try {
            const response = await this.model.find({
                courseId: courseId
            })
            return response
        } catch (error: any) {
            throw error
        }
    }


    async deleteQuizz(courseId: string, quizId: string): Promise<any> {
        try {
            const findQuizz = await this.model.findOne({ courseId: courseId }) as IQuiz;

            if (findQuizz) {
                // Convert quizId to an ObjectId for proper comparison
                const objectIdQuizId = new mongoose.Types.ObjectId(quizId);

                findQuizz.questions = findQuizz.questions.filter((question: any) =>
                    !question._id.equals(objectIdQuizId) // Use .equals for ObjectId comparison
                );

                const updatedQuizz = await findQuizz.save();
                console.log('Updated Quizz:', updatedQuizz);
                return updatedQuizz;
            } else {
                throw new Error('Quiz not found for the given courseId');
            }
        } catch (error: any) {
            console.error('Error in deleteQuizz:', error);
            throw error;
        }
    }

}