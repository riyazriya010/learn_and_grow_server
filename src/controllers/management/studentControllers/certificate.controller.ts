import getId from "../../../integration/getId";
import StudentCertificateServices, { certificateServices } from "../../../services/business/studentServices/certificate.services";
import { ErrorResponse, SuccessResponse } from "../../../utils/responseUtil";
import { Request, Response } from 'express'

export default class StudentCertificateController {
    private studentCertificateServices: StudentCertificateServices

    constructor(studentCertificateServices: StudentCertificateServices) {
        this.studentCertificateServices = studentCertificateServices
    }

    async studentGeCerfiticate(req: Request, res: Response): Promise<void> {
        try {
            const { certificateId } = req.query
            const studentId = await getId('accessToken',req) as string
            const getCertificate = await this.studentCertificateServices.studentGeCerfiticate(String(certificateId), studentId)
            SuccessResponse(res, 200, "Certificate Got It", getCertificate)
            return
        } catch (error: any) {
            ErrorResponse(res, 500, "Internal Server Error")
            return
        }
    }

    async studentCreateCertificate(req: Request, res: Response): Promise<void> {
        try {
            const userId = await getId('accessToken', req) as string
            const { username, courseName, mentorName, courseId } = req.body;
            const data = {
                studentId: userId,
                studentName: username,
                courseName,
                mentorName,
                courseId,
            };

            const createCertificate = await this.studentCertificateServices.studentCreateCertificate(data)
            SuccessResponse(res, 200, "Certificate Created", createCertificate)
            return
        } catch (error: unknown) {
            console.info('create certificate Error ::: ', error)
            ErrorResponse(res, 500, "Internal Server Error")
            return
        }
    }

    async studentGetAllCertificates(req: Request, res: Response): Promise<void> {
        try {
            const userId = await getId('accessToken', req)
            const getCertificates = await this.studentCertificateServices.studentGetAllCertificates(String(userId))
            SuccessResponse(res, 200, "Certificates All Got It", getCertificates)
            return
        } catch (error: unknown) {
            ErrorResponse(res, 500, "Internal Server Error")
            return
        }
    }
}

export const studentCertificateController = new StudentCertificateController(certificateServices)
