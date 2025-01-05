import { Document, Model } from "mongoose"
import { IMentor } from "../../models/mentor.model"
import { mentorSignUpData } from "../../interface/mentor.type"
import Mail from "../../integration/nodemailer"
import { generateAccessToken } from "../../integration/mailToken"
import bcrypt from 'bcrypt'
import { IQuiz } from "../../models/quizz.model"
import mongoose from "mongoose"


export default class MentorBaseRepository<T extends Document> {
    private model: Model<T>

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
            const { username, phone } = data
            const response = await this.model.findByIdAndUpdate(
                id,
                { username, phone },
                { new: true }
            );
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
    async getAllCourses(): Promise<any> {
        try {
            const response = await this.model.find().sort({ createdAt: -1 }).exec()
            return response
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