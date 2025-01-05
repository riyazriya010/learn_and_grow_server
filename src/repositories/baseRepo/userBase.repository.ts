import { Model, Document, FilterQuery } from "mongoose";
import { IUser } from "../../models/user.model";
import { studentLoginData } from "../../interface/userDto";
import { generateAccessToken } from "../../integration/mailToken";
import bcrypt from 'bcrypt'
import Mail from "../../integration/nodemailer";
import { ICourse } from "../../models/uploadCourse.model";
import { IPurchasedCourse } from "../../models/purchased.model";

export default class BaseRepository<T extends Document> {
    private model: Model<T>

    constructor(model: Model<T>) {
        this.model = model
    }


    async findAll(): Promise<T[]> {
        return this.model.find()
    }

    async findOne(query: FilterQuery<T>): Promise<IUser | null> {
        // Using lean() to return plain JavaScript objects instead of Mongoose Document
        const foundUser = await this.model.findOne(query).lean().exec()
        if (!foundUser) {
            return null
        }
        return foundUser as IUser
    }

    async findUsers(): Promise<IUser[] | null> {
        const users = await this.model.find().exec(); // No .lean() used

        if (!users || users.length === 0) {
            return null;
        }
        return users as unknown as IUser[]; // Returns Mongoose documents
    }

    async findByEmail(email: string): Promise<T | null> {
        return this.model.findOne({ email })
    }


    async signupStudent(data: studentLoginData): Promise<any> {
        const { username, email, phone, password } = data

        const modifiedUser = {
            username,
            email,
            phone,
            password,
            role: 'student',
            studiedHours: 0,
        }

        const document = new this.model(modifiedUser)
        const savedUser = await document.save()

        const token = await generateAccessToken({ id: savedUser.id, email: email })
        const portLink = process.env.STUDENT_PORT_LINK
        if (!portLink) {
            throw new Error('PORT_LINK environment variable is not set');
        }
        const createdLink = `${portLink}?token=${token}`
        const mail = new Mail()
        mail.sendVerificationEmail(email, createdLink)
            .then(info => {
                console.log('Verification email sent successfully:');
            })
            .catch(error => {
                console.error('Failed to send verification email:', error);
            });

        return savedUser as unknown as IUser

    }

    async studentGoogleSignIn(email: string, displayName: string): Promise<IUser | null> {
        const userData = {
            username: displayName,
            email,
            phone: 'Not Provided',
            studiedHours: 0,
            password: 'null',
            role: 'student',
            isVerified: true
        }

        const document = new this.model(userData)
        const savedUser = await document.save()

        return savedUser as unknown as IUser
    }


    async studentGoogleLogin(email: string): Promise<IUser | null> {
        const response = await this.model.findOne({ email: email })
        return response as unknown as IUser
    }



    async studentLogin(email: string, password: string): Promise<IUser | null> {

        const getUser = await this.model.findOne({ email: email }).lean<IUser>().exec();

        if (!getUser) {
            console.log('not get: ', getUser)
            return null
        }
        console.log('get: ', getUser)
        const isPassword = await bcrypt.compare(password, getUser.password)

        if (!isPassword) {
            console.log('is not pass')
            return null
        }
        console.log('is Pass')
        return getUser
    }


    async createOtp(email: string, otp: string): Promise<any> {
        try {
            const data = {
                email,
                otp
            }
            const document = new this.model(data)
            console.log(document)
            const savedOtp = await document.save()
            setTimeout(async () => {
                await this.model.findByIdAndDelete(savedOtp._id)
                console.log('otp deleted ', email)
            }, 60000)
            return savedOtp

        } catch (error) {
            console.log(error)
        }
    }


    async verifyUser(email: string): Promise<IUser | null> {

        const findUser = await this.model.findOne({ email: email }).exec()

        if (!findUser) {
            console.error('User not found:', email); // Debug log
            return null;
        }

        console.log('Found user before update:', findUser); // Debug log

        const user = findUser as unknown as IUser;

        // Update the user verification status
        user.isVerified = true;

        // Save the updated document
        const updatedUser = await user.save();
        console.log('Updated user after verification:', updatedUser)

        return updatedUser;
    }


    async forgetPassword(data: any): Promise<any> {
        try {
            const { email, password } = data

            const isUser = await this.model.findOne({ email: email }).exec()

            if (!isUser) {
                return null
            }
            const user = isUser as unknown as IUser

            const hashedPassword = await bcrypt.hash(password, 10)
            user.password = hashedPassword

            console.log('user: ', user)
            const updatedUser = await user.save()
            console.log('user2')
            return updatedUser
        } catch (error) {
            console.log(error)
        }
    }


    async checkStudent(id: string): Promise<any> {
        try {
            const response = await this.model.findById(id)
            const user = response as unknown as IUser
            return user
        } catch (error) {
            console.log(error)
        }
    }

    async studentReVerify(email: string): Promise<any> {
        try {
            const userData = await this.model.findOne({ email: email })
            if (!userData) {
                return null
            }
            const token = await generateAccessToken({ id: userData.id, email: email })
            const portLink = process.env.STUDENT_PORT_LINK
            if (!portLink) {
                throw new Error('PORT_LINK environment variable is not set');
            }
            const createdLink = `${portLink}?token=${token}`
            const mail = new Mail()
            mail.sendVerificationEmail(email, createdLink)
                .then(info => {
                    console.log('Verification email sent successfully:');
                })
                .catch(error => {
                    console.error('Failed to send verification email:', error);
                });
            return userData as unknown as IUser
        } catch (error) {
            console.log(error)
        }
    }


    async isUserBlocked(email: string): Promise<any> {
        try {
            const response = await this.model.findOne({ email: email })
            const user = response as unknown as IUser
            if (user.isBlocked) {
                return true
            }
            return false
        } catch (error) {
            console.log(error)
        }
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

    async isBlocked(id: string): Promise<any> {
        try {
            const response = await this.model.findById(id)
            const user = response as unknown as IUser
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
            const user = response as unknown as IUser
            if (user.isVerified) {
                return true
            }
            return false
        } catch (error) {
            console.log(error)
        }
    }



    /* ------------------------------ WEEK - 2 -------------------------*/

    // async getAllCourses(): Promise<any> {
    //     try {
    //         const response = await this.model.find()

    //         if (!response || response.length === 0) {
    //             const error = new Error('Courses Not Found')
    //             error.name = 'CoursesNotFound'
    //             throw error
    //         }

    //         return response

    //     } catch (error) {
    //         console.log(error)
    //     }
    // }

    async getAllCourses(page: number = 1, limit: number = 6): Promise<any> {
        try {
            // Calculate skip value for pagination
            const skip = (page - 1) * limit;

            // Fetch courses with pagination
            const response = await this.model
                .find()  // Add any filtering if needed
                .skip(skip)
                .limit(limit);

            // Get the total count of courses for pagination
            const totalCourses = await this.model.countDocuments();

            // If no courses found
            if (!response || response.length === 0) {
                const error = new Error('Courses Not Found');
                error.name = 'CoursesNotFound';
                throw error;
            }

            // Return the paginated courses along with total information
            return {
                courses: response,
                currentPage: page,
                totalPages: Math.ceil(totalCourses / limit),
                totalCourses: totalCourses
            };
        } catch (error) {
            console.log(error);
            throw error;  // Propagate error if needed
        }
    }


    async getCourse(id: string): Promise<any> {
        try {
            const findCourse = await this.model.findById(id)
            if (!findCourse) {
                const error = new Error('Course Not Found')
                error.name = 'Course Not Found'
                throw error
            }
            return findCourse
        } catch (error: any) {
            console.log(error)
        }
    }


    async getCoursePlay(id: string): Promise<any> {
        try {
            // Fetch the course and populate the fullVideo.chapterId field
            const response = await this.model.findById(id)
                .populate('fullVideo.chapterId') // Populate the chapterId field in fullVideo

            // If the course is not found, throw an error
            if (!response) {
                const error = new Error('Courses Not Found')
                error.name = 'CoursesNotFound'
                throw error
            }

            const res = response as unknown as ICourse
            // Extract the chapters from the populated fullVideo field
            const chapters = res?.fullVideo?.map((video: any) => video.chapterId) || [];

            // Return the course data along with the populated chapters
            return {
                course: response,
                chapters,
            };
        } catch (error: any) {
            console.log(error);
            throw new Error("Error fetching course and chapters");
        }

    }


    async filterData(page: number = 1, limit: number = 6, selectedCategory: string, selectedLevel: string, searchTerm: string): Promise<any> {
        try {

            console.log('filters: ', selectedCategory, selectedLevel, searchTerm);

            const skip = (page - 1) * limit;

            const query: any = {};
            if (selectedCategory !== 'undefined') {
                query.category = { $regex: `^${selectedCategory}$`, $options: 'i' };
            }
            if (selectedLevel !== 'undefined') {
                query.level = { $regex: `^${selectedLevel}$`, $options: 'i' };
            }
            if (searchTerm !== 'undefined') {
                console.log('search: ', searchTerm)
                query.courseName = { $regex: searchTerm, $options: 'i' };
            }

            const courses = await this.model.find(query).skip(skip).limit(limit);

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

    public async findCourseById(courseId: string): Promise<any> {
        try {
            const isCourse = await this.model.findById(courseId)
            return isCourse
        } catch (error: any) {
            throw error
        }
    }


    public async findChaptersById(courseId: string): Promise<any> {
        try {
            const isChapters = await this.model.find({ courseId: courseId })
            return isChapters
        } catch (error: any) {
            throw error
        }
    }


    public async buyCourse(userId: string, courseId: string, completedChapters: any, txnid: string): Promise<any> {
        try {
            // find the course with course id if the course were there then
            // create a new docs in the purchasecourse model withi this id and userId
            const purchasedCourse = {
                userId,
                courseId,
                completedChapters,
                isCourseCompleted: false
            }

            const document = new this.model(purchasedCourse)
            const savedUser = await document.save()

            return savedUser

        } catch (error: any) {
            throw error
        }
    }



    public async getBuyedCourses(userId: string): Promise<any> {
        try {
            const findCourses = this.model.find(
                { userId: userId }
            ).sort({ createdAt: -1 })
                .populate('courseId', 'courseName level')
                .exec()

            return findCourses
        } catch (error: any) {
            throw error
        }
    }




    public async coursePlay(buyedId: string): Promise<any> {
        try {
            // Find the purchased course and populate course and chapters
            const purchasedCourse = await this.model.findById(buyedId)
                .populate({
                    path: 'courseId', // Populate course details
                    select: 'courseName duration level description category thumbnailUrl', // Select specific fields from Course
                    populate: {
                        path: 'fullVideo.chapterId', // Populate chapters from Course
                        model: 'Chapter', // Specify the Chapter model
                        select: 'chapterTitle courseId chapterNumber description videoUrl createdAt', // Select specific fields
                    },
                })
                .exec() as unknown as IPurchasedCourse

            if (!purchasedCourse) {
                throw new Error('Purchased course not found');
            }

            // Extract data
            const courseData = purchasedCourse.courseId as unknown as ICourse
            const chaptersData = courseData?.fullVideo?.map((video: any) => video.chapterId);

            // Format the response
            return {
                purchasedCourse, // All data from the purchased course
                course: {
                    courseName: courseData?.courseName,
                    duration: courseData?.duration,
                    level: courseData?.level,
                    description: courseData?.description,
                    category: courseData?.category,
                    thumbnailUrl: courseData?.thumbnailUrl,
                },
                chapters: chaptersData, // All chapter data
            };
        } catch (error: any) {
            throw error
        }
    }


    public async chapterVideoEnd(chapterId: string): Promise<any> {
        try {

            const findChapter = await this.model.findOne({
                "completedChapters.chapterId": chapterId
            }) as unknown as IPurchasedCourse

            if (!findChapter) {
                return 'Purchased Course not Found'
            }

            const chapterIndex = findChapter.completedChapters.findIndex((chapter) => chapter.chapterId.toString() === chapterId);

            if (chapterIndex === -1) {
                return `Chapter Not Found`
            }

            findChapter.completedChapters[chapterIndex].isCompleted = true

            const updatedChapters = await findChapter.save()

            return updatedChapters

        } catch (error: any) {
            throw error
        }
    }


    public async getCertificate(certificateId: string): Promise<any> {
        try{
            const findCertificate = await this.model.findById(certificateId)
            if(findCertificate){
                return findCertificate
            }
        }catch(error: any){
            throw error
        }
    }

}

