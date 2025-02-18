import { MentorEditCourseInput, mentorFilterCourse, mentorGetALlCourseOuput } from "../../../interface/mentors/mentor.types";
import { ICategory } from "../../../models/categroy.model";
import { ICourse } from "../../../models/uploadCourse.model";
import MentorCourseRepository from "../../../repositories/entities/mentorRepositories/course.repository";



export default class MentorCourseServices {
    private mentorCourseRepository: MentorCourseRepository

    constructor(mentorCourseRepository: MentorCourseRepository) {
        this.mentorCourseRepository = mentorCourseRepository;
    }

        async mentorAddCourse(data: any): Promise<ICourse | null> {
            try {
                const addCourse = await this.mentorCourseRepository.mentorAddCourse(data)
                return addCourse
            } catch (error: unknown) {
                throw error
            }
        }
    
        async mentorGetAllCourse(userId: string, page: number, limit: number): Promise<mentorGetALlCourseOuput | null> {
            try {
                const getAllCourses = await this.mentorCourseRepository.mentorGetAllCourse(userId, page, limit)
                return getAllCourses
            } catch (error: unknown) {
                throw error
            }
        }
    
        async mentorGetCourse(courseId: string, mentorId: string): Promise<ICourse | null> {
            try {
                const getCourse = await this.mentorCourseRepository.mentorGetCourse(courseId, mentorId)
                return getCourse
            } catch (error: unknown) {
                throw error
            }
        }
    
        async mentorEditCourse(courseId: string, updatedFields: MentorEditCourseInput): Promise<ICourse | null> {
            try {
                const editCourse = await this.mentorCourseRepository.mentorEditCourse(courseId, updatedFields)
                return editCourse
            } catch (error: unknown) {
                throw error
            }
        }
    
        async mentorUnPulishCourse(courseId: string): Promise<ICourse | null> {
            try{
                const unPublish = await this.mentorCourseRepository.mentorUnPulishCourse(courseId)
                return unPublish
            }catch(error: unknown){
                throw error
            }
        }
    
        async mentorPublishCourse(courseId: string): Promise<ICourse | null> {
            try{
                const publish = await this.mentorCourseRepository.mentorPublishCourse(courseId)
                return publish
            }catch(error: unknown){
                throw error
            }
        }
    
        async mentorFilterCourse(page: number, limit: number, searchTerm: string, mentorId: string): Promise<mentorFilterCourse | null>{
            try{
                const filterCourse = await this.mentorCourseRepository.mentorFilterCourse(page, limit, searchTerm, mentorId)
                return filterCourse
            }catch(error: unknown){
                throw error
            }
        }
    
        async mentorGetAllCategorise(): Promise<ICategory[] | null> {
            try{
                const getAllCategories =  await this.mentorCourseRepository.mentorGetAllCategorise()
                return getAllCategories
            }catch(error: unknown){
                throw error
            }
        }

}

const mentorCourseRepository = new MentorCourseRepository()
export const mentorCourseServices = new MentorCourseServices(mentorCourseRepository)
