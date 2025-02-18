import mongoose from "mongoose";
import { IStudentCertificateMethods } from "../../../interface/students/student.interface";
import { StudentCreateCreatificateData } from "../../../interface/students/student.types";
import { CertificateModel, ICertificate } from "../../../models/certificate.model";
import StudentCertificateBaseRepository from "../../baseRepositories/studentBaseRepositories/certificateBaseRepository";
import { BadgeModel, IBadge } from "../../../models/studentBadges.model";
import { BadgeManagementModel, IBadgeManagement } from "../../../models/adminBadge.model";
import CommonBaseRepository from "../../baseRepositories/commonBaseRepository";

export default class StudentCertificateRepository extends CommonBaseRepository<{
    Certificate: ICertificate;
    BadgeManagement: IBadgeManagement;
    Badge: IBadge;
}> implements IStudentCertificateMethods {

    constructor() {
        super({
            Certificate: CertificateModel,
            BadgeManagement: BadgeManagementModel,
            Badge: BadgeModel
        })
    }

    async studentGeCerfiticate(certificateId: string, studentId: string): Promise<ICertificate> {
        try {
            // const findCertificate = await this.findById('Certificate', certificateId)
            const findCertificate = await this.findOne('Certificate', {_id: certificateId, userId: studentId})

            if (!findCertificate) {
                return {
                    _id: '',
                    userId: '',
                    courseId: '',
                    courseName: '',
                    mentorName: '',
                    userName: '',
                    issuedDate: '',
                    createdAt: '',
                    updatedAt: '',
                    __v: 0
                } as unknown as ICertificate;
            }

            return findCertificate as unknown as ICertificate
        } catch (error: unknown) {
            throw error
        }
    }

    async studentCreateCertificate(certificateData: StudentCreateCreatificateData): Promise<ICertificate> {
        try {
            const { studentId, studentName, courseName, mentorName, courseId } = certificateData;

            const certificteData = {
                userId: new mongoose.Types.ObjectId(studentId),
                userName: studentName,
                courseName,
                mentorName,
                courseId: new mongoose.Types.ObjectId(courseId)
            }

            const certificate = await this.createData('Certificate', certificteData as unknown as Partial<ICertificate>);

            const savedCertificate = await certificate.save();

            //creating badge for student
            const findBadge = await this.findOne('BadgeManagement', { badgeName: 'Course Completion' })
            
            const badgeData = {
                userId: new mongoose.Types.ObjectId(studentId),
                badgeId: new mongoose.Types.ObjectId(String(findBadge?._id))
            }

            const createBadge = await this.createData('Badge', badgeData as unknown as Partial<IBadge>)
            await createBadge.save()

            return savedCertificate;

        } catch (error: unknown) {
            throw error
        }
    }

    async studentGetAllCertificates(studentId: string): Promise<ICertificate[]> {
        try{
            const getCertificates = await this.findAll('Certificate',{ userId: studentId })
            .sort({ issuedDate: -1 })

            return getCertificates
        }catch(error: unknown){
            throw error
        }
    }
    
}