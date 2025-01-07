import { Model, Document, FilterQuery } from "mongoose";
import UserModel, { IUser } from "../../models/user.model";
import { studentLoginData } from "../../interface/userDto";
import { generateAccessToken } from "../../integration/mailToken";
import bcrypt from 'bcrypt'
import Mail from "../../integration/nodemailer";
import { ICourse } from "../../models/uploadCourse.model";
import { IPurchasedCourse } from "../../models/purchased.model";
import { IUserWallet, UserWalletModel } from "../../models/userWallet.model";
import { IMentorWallet, MentorWalletModel } from "../../models/mentorWallet.model";
import { AdminWalletModel, IAdminWallet } from "../../models/adminWallet.model";

export default class BaseRepository<T extends Document> {
    private model: Model<T>
    private userWalletModel: Model<IUserWallet> = UserWalletModel as Model<IUserWallet>;
    private mentorWalletModel: Model<IMentorWallet> = MentorWalletModel as Model<IMentorWallet>;
    private adminWalletModel: Model<IAdminWallet> = AdminWalletModel as Model<IAdminWallet>;
    private userModel: Model<IUser> = UserModel as Model<IUser>;

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


    async signupStudent(data: studentLoginData): Promise<any> {
        try {
            const { username, email, phone, password } = data

            const existUser = await this.userModel.findOne({ email: email })
            if (existUser) {
                const error = new Error('User Already Exist')
                error.name = 'UserAlreadyExit'
                throw error
            }

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
        } catch (error: unknown) {
            if (error instanceof Error) {
                if (error.name === 'UserAlreadyExit') {
                    throw error
                }
            }
            throw error
        }

    }

    async studentGoogleSignIn(email: string, displayName: string): Promise<IUser | null> {

        try {
            const existUser = await this.userModel.findOne({ email: email })
            if (existUser) {
                const error = new Error('User Already Exist')
                error.name = 'UserAlreadyExit'
                throw error
            }

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
        } catch (error: unknown) {
            if (error instanceof Error) {
                if (error.name === 'UserAlreadyExit') {
                    throw error
                }
            }
            throw error
        }
    }


    async studentGoogleLogin(email: string): Promise<IUser | null> {
        try {
            const existUser = await this.model.findOne({ email: email }) as unknown as IUser

            if (!existUser) {
                const error = new Error('User Not Found')
                error.name = 'UserNotFound'
                throw error
            }

            if (existUser?.isBlocked === true) {
                const error = new Error('User Blocked')
                error.name = 'UserBlocked'
                throw error
            }

            return existUser as unknown as IUser

        } catch (error: unknown) {
            if (error instanceof Error) {
                if (error.name === 'UserNotFound' || error.name === 'UserBlocked') {
                    throw error;
                }
            }
            throw error
        }
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

            return response;
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

    async getAllCourses(page: number = 1, limit: number = 6): Promise<any> {
        try {
            const skip = (page - 1) * limit;

            const response = await this.model
                .find()
                .skip(skip)
                .limit(limit)
                .sort({ createdAt: -1 })

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
        } catch (error) {
            throw error;
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
            const response = await this.model.findById(id)
                .populate('fullVideo.chapterId')

            if (!response) {
                const error = new Error('Courses Not Found')
                error.name = 'CoursesNotFound'
                throw error
            }

            const res = response as unknown as ICourse
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


    //  this is for buying course
    public async findCourseById(courseId: string, amount: number, courseName: string): Promise<any> {
        try {

            // Find the course by its ID and populate mentor details
            const isCourse = await this.model
                .findById(courseId)
                .populate("mentorId", "name email") as unknown as ICourse

            if (!isCourse) {
                throw new Error("Course not found");
            }

            // Extract mentorId and courseName from the course
            const mentorId = isCourse.mentorId
            const courseName = isCourse.courseName;

            // Calculate the 90% for mentor and 10% for admin
            const mentorAmount = (amount * 90) / 100;
            const adminCommission = (amount * 10) / 100;

            // Add 90% to mentor's wallet
            const mentorWallet = await this.mentorWalletModel.findOne({ mentorId });

            if (mentorWallet) {
                mentorWallet.balance += Number(mentorAmount);
                mentorWallet.transactions.push({
                    type: "credit",
                    amount: Number(mentorAmount),
                    date: new Date(),
                    courseName,
                    adminCommission: `${adminCommission.toFixed(2)} (10%)`,
                });
                await mentorWallet.save();
            } else {
                // Create a new wallet if it doesn't exist
                await this.mentorWalletModel.create({
                    mentorId,
                    balance: Number(mentorAmount),
                    transactions: [
                        {
                            type: "credit",
                            amount: Number(mentorAmount),
                            date: new Date(),
                            courseName,
                            adminCommission: `${adminCommission.toFixed(2)} (10%)`,
                        },
                    ],
                });
            }

            // Add 10% to admin's wallet
            const adminWallet = await this.adminWalletModel.findOne({ adminId: "admin" });

            if (adminWallet) {
                adminWallet.balance += Number(adminCommission);
                adminWallet.transactions.push({
                    type: "credit",
                    amount: Number(adminCommission),
                    date: new Date(),
                    courseName,
                });
                await adminWallet.save();
            } else {
                // Create a new wallet if it doesn't exist
                await this.adminWalletModel.create({
                    adminId: "admin",
                    balance: Number(adminCommission),
                    transactions: [
                        {
                            type: "credit",
                            amount: Number(adminCommission),
                            date: new Date(),
                            courseName,
                        },
                    ],
                });
            }

            // Return the full course details
            // return {
            //     success: true,
            //     message: "Amount distributed successfully",
            //     course: isCourse,
            // };

            // const isCourse = await this.model.findById(courseId)
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



    public async getBuyedCourses(userId: string, page: number = 1, limit: number = 4): Promise<any> {
        try {

            const skip = (page - 1) * limit;

            // Fetch the courses with pagination and populate course details
            const response = await this.model
                .find({ userId: userId })
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .populate("courseId", "courseName level")
                .exec();

            // Count the total number of courses for the user
            const totalCourses = await this.model.countDocuments({ userId: userId });

            // Check if no courses are found
            if (!response || response.length === 0) {
                const error = new Error("No courses found for the user.");
                error.name = "CoursesNotFound";
                throw error;
            }

            // Return the paginated data
            return {
                courses: response,
                currentPage: page,
                totalPages: Math.ceil(totalCourses / limit),
                totalCourses: totalCourses,
            };
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
        try {
            const findCertificate = await this.model.findById(certificateId)
            if (findCertificate) {
                return findCertificate
            }
        } catch (error: any) {
            throw error
        }
    }


    public async getQuizz(courseId: string): Promise<any> {
        try {
            const findQuizz = await this.model.findOne(
                { courseId: courseId }
            )
            if (findQuizz) {
                return findQuizz
            }
        } catch (error: any) {
            throw error
        }
    }


    public async completeCourse(userId: string, courseId: string): Promise<any> {
        try {
            const findCourse = await this.model.findOne({ userId, courseId })
                .populate({
                    path: 'courseId',
                    select: 'courseName',
                    populate: {
                        path: 'mentorId',
                        model: 'Mentors',
                        select: 'username'
                    }
                })
                .exec() as unknown as IPurchasedCourse;

            if (findCourse.isCourseCompleted) {
                return 'Course Already Completed'
            }

            findCourse.isCourseCompleted = true;

            const courseData = findCourse.courseId as unknown as ICourse

            const updatedCourse = await findCourse.save();

            const mentor = (courseData?.mentorId as unknown as { username: string }) || { username: null };

            return {
                updatedCourse,
                courseName: courseData?.courseName,
                mentorName: mentor.username,
            }

        } catch (error: any) {
            throw error
        }
    }



    public async createCertificate(data: any): Promise<any> {
        try {
            const { userId, username, courseName, mentorName, courseId } = data;

            // Create and save certificate
            const certificate = new this.model({
                userId,
                userName: username,
                courseName,
                mentorName,
                courseId,
            });

            const savedCertificate = await certificate.save();

            return savedCertificate;
        } catch (error: any) {
            throw error
        }
    }



    public async getCertificates(): Promise<any> {
        try {
            const response = await this.model.find()
            return response
        } catch (error: any) {
            throw error
        }
    }

}

