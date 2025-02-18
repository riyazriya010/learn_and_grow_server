import { StudentCreateCreatificateData } from "../../../interface/students/student.types";
import { ICertificate } from "../../../models/certificate.model";
import StudentCertificateRepository from "../../../repositories/entities/studentRepository/certificate.repository";


export default class StudentCertificateServices {
    private studentCertificateRepository: StudentCertificateRepository

    constructor(studentCertificateRepository: StudentCertificateRepository) {
        this.studentCertificateRepository = studentCertificateRepository;
    }

    async studentGeCerfiticate(certificateId: string, studentId: string): Promise<ICertificate | null> {
        try {
            const getCertificate = await this.studentCertificateRepository.studentGeCerfiticate(certificateId, studentId)
            return getCertificate
        } catch (error: unknown) {
            throw error
        }
    }
    async studentCreateCertificate(data: StudentCreateCreatificateData): Promise<ICertificate> {
        try {
            const createCertificate = await this.studentCertificateRepository.studentCreateCertificate(data)
            return createCertificate
        } catch (error: unknown) {
            throw error
        }
    }

    async studentGetAllCertificates(studentId: string): Promise<ICertificate[]> {
        try{
            const getCertificates = await this.studentCertificateRepository.studentGetAllCertificates(studentId)
            return getCertificates
        }catch(error: unknown){
            throw error
        }
    }
}

const certificateRepository = new StudentCertificateRepository()
export const certificateServices = new StudentCertificateServices(certificateRepository)
