import { generateAccessToken, verifyToken } from "../../integration/mailToken";
import Mail from "../../integration/nodemailer";
import { IStudentMethods } from "../../interface/students/student.interface";
import { StudentBuyCourseInput, StudentChatGetUsersOutput, studentCompleteCourse, StudentCourseFilterData, StudentCoursePlay, StudentCreateCreatificateData, studentFilterCoursesOuput, studentGetAllCoursesOuput, studentGetBuyedCourses, StudentGetCourseOuput, StudentGetCoursePlayOutput, StudentProfileInput, StudentSignUpInput } from "../../interface/students/student.types";
import { ICertificate } from "../../models/certificate.model";
import { IChatRooms } from "../../models/chatRooms.model";
import { IMessages } from "../../models/messages.model";
import { IPurchasedCourse } from "../../models/purchased.model";
import { IQuiz } from "../../models/quizz.model";
import { IBadge } from "../../models/studentBadges.model";
import { ICourse } from "../../models/uploadCourse.model";
import { IUser } from "../../models/user.model";
import bcrypt from 'bcrypt'

export default class StudentServices {
    private studentRepository: IStudentMethods;

    constructor(studentRepository: IStudentMethods) {
        this.studentRepository = studentRepository;
    }


    //////////////////////// WEEK - 1 ////////////////////////////////////

    async studentLogin(email: string, password: string): Promise<IUser | null> {
        try {
            const findUser = await this.studentRepository.studentLogin(email, String(password))
            console.log('find ', findUser)
            if (!findUser) {
                const error = new Error('Email Not Found')
                error.name = 'EmailNotFound'
                throw error
            }

            const isPassword = await bcrypt.compare(password, findUser.password)
            if (!isPassword) {
                const error = new Error('Password Invalid')
                error.name = 'PasswordInvalid'
                throw error
            }
            console.log('pass ', isPassword)

            if (findUser.isBlocked) {
                const error = new Error('Student Blocked')
                error.name = 'StudentBlocked'
                throw error
            }
            console.log('uernot block: ', findUser)

            return findUser

        } catch (error: unknown) {
            throw error
        }
    }

    async studentSignUp(userData: StudentSignUpInput): Promise<IUser | null> {
        try {
            const hashPassword = await bcrypt.hash(userData.password, 10)
            userData.password = hashPassword

            const addUser = await this.studentRepository.studentSignUp(userData)

            const token = await generateAccessToken({ id: String(addUser?._id), email: String(addUser?.email) })
            const portLink = process.env.STUDENT_PORT_LINK
            const createdLink = `${portLink}?token=${token}`
            const mail = new Mail()
            mail.sendVerificationEmail(String(addUser?.email), createdLink)
                .then(info => {
                    console.log('Verification email sent successfully:');
                })
                .catch(error => {
                    console.error('Failed to send verification email:', error);
                });

            return addUser
        } catch (error: unknown) {
            throw error
        }
    }

    async studentGoogleSignUp(email: string, displayName: string): Promise<IUser | null> {
        try {
            const addUser = await this.studentRepository.studentGoogleSignUp({ email, displayName })
            return addUser
        } catch (error: unknown) {
            throw error
        }
    }

    async studentGoogleLogin(email: string): Promise<IUser | null> {
        try {
            const findUser = await this.studentRepository.studentGoogleLogin(email)
            return findUser
        } catch (error: unknown) {
            throw error
        }
    }

    async studentForgetPassword(email: string, password: string): Promise<void> {
        try {
            const hashPassword = await bcrypt.hash(password, 10)
            password = hashPassword
            const updatePassword = await this.studentRepository.studentForgetPassword(email, password)
            return
        } catch (error: unknown) {
            throw error
        }
    }

    async studentVerify(token: string): Promise<IUser | null> {
        try {
            const verifiedToken = await verifyToken(token)
            if (!verifiedToken.status) {
                const error = new Error('Token Expired')
                error.name = 'tokenExpired'
                throw error
            }

            const payload = verifiedToken.payload;
            if (!payload || typeof payload !== 'object' || !('id' in payload) || !('email' in payload)) {
                const error = new Error('Invalid token payload')
                error.name = 'Invalidtokenpayload'
                throw error
            }
            const { email } = payload;
            const verifyStudent = await this.studentRepository.studentVerify(email)
            return verifyStudent
        } catch (error: unknown) {
            throw error
        }
    }

    async studentProfleUpdate(studentId: string, data: StudentProfileInput): Promise<IUser | null> {
        try {
            const updateUser = await this.studentRepository.studentProfleUpdate(studentId, data)
            return updateUser
        } catch (error: unknown) {
            throw error
        }
    }

    async studentReVerify(email: string): Promise<IUser | null> {
        try {
            const findUser = await this.studentRepository.studentReVerify(email)
            const token = await generateAccessToken({ id: String(findUser?._id), email: email })
            const portLink = process.env.STUDENT_PORT_LINK
            const createdLink = `${portLink}?token=${token}`
            const mail = new Mail()
            mail.sendVerificationEmail(email, createdLink)
                .then(info => {
                    console.log('Verification email sent successfully:');
                })
                .catch(error => {
                    console.error('Failed to send verification email:', error);
                });
            return findUser
        } catch (error: unknown) {
            throw error
        }
    }

    async studentCheck(studentId: string): Promise<IUser | null> {
        try {
            const checkStudent = await this.studentRepository.studentCheck(studentId)
            return checkStudent
        } catch (error: unknown) {
            throw error
        }
    }


    async studentGetAllCourses(page: string, limit: string): Promise<studentGetAllCoursesOuput | null> {
        try {
            const pageNumber = parseInt(page as string, 10);
            const limitNumber = parseInt(limit as string, 10);
            if (pageNumber < 1 || limitNumber < 1) {
                const error = new Error('Invalid Page or Limit Value')
                error.name = 'InvalidPageOrLimit'
                throw error
            }
            const getAllCourse = await this.studentRepository.studentGetAllCourses(pageNumber, limitNumber)
            return getAllCourse
        } catch (error: unknown) {
            throw error
        }
    }


    ////////////////
    async studentGetCourse(courseId: string, studentId: string): Promise<StudentGetCourseOuput | null> {
        try {
            const getCourse = await this.studentRepository.studentGetCourse(courseId, studentId)
            return getCourse
        } catch (error: unknown) {
            throw error
        }
    }

    async studentCourseFilterData(filterData: StudentCourseFilterData): Promise<studentFilterCoursesOuput | null> {
        try {
            const pageNumber = parseInt(String(filterData.pageNumber) as string, 10);
            const limitNumber = parseInt(String(filterData.limitNumber) as string, 10);

            if (pageNumber < 1 || limitNumber < 1) {
                const error = new Error('Invalid Page or Limit Value')
                error.name = 'InvalidPageOrLimit'
                throw error
            }
            const filteredCourse = await this.studentRepository.studentCourseFilterData(
                {
                    pageNumber,
                    limitNumber,
                    selectedCategory: filterData.selectedCategory,
                    selectedLevel: filterData.selectedLevel,
                    searchTerm: filterData.searchTerm
                }
            )
            return filteredCourse
        } catch (error: unknown) {
            throw error
        }
    }

    async studentGetCoursePlay(courseId: string): Promise<StudentGetCoursePlayOutput> {
        try {
            const getCoursePlay = await this.studentRepository.studentGetCoursePlay(courseId)
            return getCoursePlay
        } catch (error: unknown) {
            throw error
        }
    }

    async studentBuyCourse(purchaseData: StudentBuyCourseInput): Promise<IPurchasedCourse> {
        try {
            const buyCourse = await this.studentRepository.studentBuyCourse(purchaseData)
            return buyCourse
        } catch (error: unknown) {
            throw error
        }
    }

    async studentBuyedCourses(studentId: string, page: string, limit: string): Promise<studentGetBuyedCourses | null> {
        try {
            const pageNumber = parseInt(page as string, 10)
            const limitNumber = parseInt(limit as string, 10)
            const buyedCourse = await this.studentRepository.studentBuyedCourses(studentId, pageNumber, limitNumber)
            //main logic here
            if (buyedCourse?.courses) {
                const formattedResponse = buyedCourse?.courses?.map((course: any) => ({
                    _id: course._id,
                    courseDetails: {
                        courseName: course.courseId.courseName,
                        level: course.courseId.level,
                    },
                    completedChapters: course.completedChapters,
                    isCourseCompleted: course.isCourseCompleted,
                    purchasedAt: course.purchasedAt,
                }));

                buyedCourse.courses = formattedResponse
            }

            return buyedCourse
        } catch (error: unknown) {
            throw error
        }
    }

    async studentCoursePlay(purchaseId: string): Promise<StudentCoursePlay> {
        try {
            const coursePlay = await this.studentRepository.studentCoursePlay(purchaseId)
            return coursePlay
        } catch (error: unknown) {
            throw error
        }
    }

    async studentChapterVideoEnd(chapterId: string, studiedTime: string): Promise<IPurchasedCourse> {
        try {
            const findCoures = await this.studentRepository.studentChapterVideoEnd(chapterId, studiedTime)
            return findCoures
        } catch (error: unknown) {
            throw error
        }
    }

    async studentGeCerfiticate(certificateId: string): Promise<ICertificate> {
        try {
            const getCertificate = await this.studentRepository.studentGeCerfiticate(certificateId)
            return getCertificate
        } catch (error: unknown) {
            throw error
        }
    }

    async studentCompleteCourse(studentId: string, courseId: string): Promise<studentCompleteCourse> {
        try {
            const completeCourse = await this.studentRepository.studentCompleteCourse(studentId, courseId)
            return completeCourse
        } catch (error: unknown) {
            throw error
        }
    }

    async studentQuizz(courseId: string): Promise<IQuiz> {
        try {
            const getQuizz = await this.studentRepository.studentQuizz(courseId)
            return getQuizz
        } catch (error: unknown) {
            throw error
        }
    }

    async studentCreateCertificate(data: StudentCreateCreatificateData): Promise<ICertificate> {
        try {
            const createCertificate = await this.studentRepository.studentCreateCertificate(data)
            return createCertificate
        } catch (error: unknown) {
            throw error
        }
    }

    async studentGetAllCertificates(studentId: string): Promise<ICertificate[]> {
        try {
            const getCertificates = await this.studentRepository.studentGetAllCertificates(studentId)
            return getCertificates
        } catch (error: unknown) {
            throw error
        }
    }

    ///////////////////////// WEEk - 3 ////////////////////////////

    async studentChatGetMentors(studentId: string): Promise<any> {
        try {
            const getMentors = await this.studentRepository.studentChatGetMentors(studentId)
            return getMentors
        } catch (error: unknown) {
            throw error
        }
    }

    async studentCreateRoom(studentId: string, mentorId: string): Promise<any> {
        try {
            const createdRoom = await this.studentRepository.studentCreateRoom(studentId, mentorId)
            return createdRoom
        } catch (error: unknown) {
            throw error
        }
    }

    async studentSaveMessage(studentId: string, mentorId: string, message: string): Promise<any> {
        try {
            const savedMessage = await this.studentRepository.studentSaveMessage(studentId, mentorId, message)
            return savedMessage
        } catch (error: unknown) {
            throw error
        }
    }

    async studentGetMessages(studentId: string, mentorId: string): Promise<any> {
        try {
            const getMessage = await this.studentRepository.studentGetMessages(studentId, mentorId)
            return getMessage
        } catch (error: unknown) {
            throw error
        }
    }

    async studentDeleteEveryOne(messageId: string): Promise<any> {
        try {
            const deleteEveryOne = await this.studentRepository.studentDeleteEveryOne(messageId)
            return deleteEveryOne
        } catch (error: unknown) {
            throw error
        }
    }

    async studentDeleteForMe(messageId: string): Promise<any> {
        try {
            const deleteForMe = await this.studentRepository.studentDeleteForMe(messageId)
            return deleteForMe
        } catch (error: unknown) {
            throw error
        }
    }

    async studentResetCount(studentId: string, mentorId: string): Promise<any> {
        try {
            const resetCount = await this.studentRepository.studentResetCount(studentId, mentorId)
            return resetCount
        } catch (error: unknown) {
            throw error
        }
    }

    //Notification
    async studentCreateNotification(username: string, senderId: string, receiverId: string): Promise<any> {
        try {
            const createNotify = await this.studentRepository.studentCreateNotification(username, senderId, receiverId)
            return createNotify
        } catch (error: unknown) {
            throw error
        }
    }

    async studentGetNotifications(studentId: string): Promise<any> {
        try {
            const getNotification = await this.studentRepository.studentGetNotifications(studentId)
            return getNotification
        } catch (error: unknown) {
            throw error
        }
    }

    async studentGetNotificationsCount(studentId: string): Promise<any> {
        try{
            const getCount = await this.studentRepository.studentGetNotificationsCount(studentId)
            return getCount
        }catch(error: unknown){
            throw error
        }
    }

    async studentGetNotificationsSeen(): Promise<any> {
        try{
            const markSeen = await this.studentRepository.studentGetNotificationsSeen()
            return markSeen
        }catch(error: unknown){
            throw error
        }
    }

    async studentDeleteNotifications(senderId: string): Promise<any> {
        try{
            const deleteNotify = await this.studentRepository.studentDeleteNotifications(senderId)
            return deleteNotify
        }catch(error: unknown){
            throw error
        }
    }

    async studentGetMentor(studentId: string, mentorId: string): Promise<any> {
        try{
            const getMentor = await this.studentRepository.studentGetMentor(studentId, mentorId)
            return getMentor
        }catch(error: unknown){
            throw error
        }
    }

    async studentGetBadges(studentId: string): Promise<IBadge[] | null> {
        try {
            const getBadges = await this.studentRepository.studentGetBadges(studentId)
            return getBadges
        } catch (error: unknown) {
            throw error
        }
    }

 
}

