import { ObjectId } from "mongodb";
import { ICourse } from "../../models/uploadCourse.model";
import { IPurchasedCourse } from "../../models/purchased.model";
/////////////////////// WEEK - 1 ///////////////////////

// Input


export type StudentGoogleSignupInput = {
    email: string;
    displayName: string;
}

export type StudentProfileInput = {
    username: string;
    phone: string;
    profilePicUrl: string;
}

// Output



/////////////////////// WEEk - 2 /////////////////////////
export type studentGetAllCoursesOuput = {
    courses: ICourse[],
    currentPage: any
    totalPages: any
    totalCourses: any
}

export type studentFilterCoursesOuput = {
    courses: ICourse[],
    currentPage: any
    totalPages: any
    totalCourses: any
}

export type studentGetBuyedCourses = {
    courses: any,
    currentPage: any,
    totalPages: any,
    totalCourses: any,
}

export type StudentGetCourseOuput = {
    course: ICourse,
    alreadyBuyed?: string;
    chapters: any;
}

export type StudentCourseFilterData = {
    pageNumber: number;
    limitNumber: number;
    selectedCategory: string;
    selectedLevel: string;
    searchTerm: string;
}


export interface ChapterProgress { // this is for StudentBuyCourse below
    chapterId: string;
    isCompleted: boolean;
}

export type StudentBuyCourseInput = {
    userId: string;
    courseId: string;
    amount: string;
    txnid: string;
}

export  type StudentCreateCreatificateData = {
    studentId: string;
    studentName: string;
    courseName: string;
    mentorName: string;
    courseId: string;
}

export type StudentGetCoursePlayOutput = {
    course: ICourse;
    chapters: any[]
}

export type StudentCoursePlay = {
    purchasedCourse: IPurchasedCourse;
    course: any;
    chapters: any;
}

export type studentCompleteCourse = {
    updatedCourse: IPurchasedCourse;
    courseName: string;
    mentorName: string;
}


////////////////////////////// WEEK - 3 /////////////////////
export type StudentChatGetUsersOutput = Array<{
    lastMessage?: string; // This is optional as `getRoom?.lastMessage` can be undefined
    userData: {
      username: string;
      profilePicUrl: string;
      [key: string]: any; // Additional properties
    };
    mentorData: {
      username: string;
      profilePicUrl: string;
      [key: string]: any; // Additional properties
    };
  }>;








  ////////////////////////// Auth ////////////////

  export interface StudentAuthResponse {
    success: boolean;
    message: string;
    result?: {
        _id: string;
        username: string;
        email: string;
        role: string;
        accessToken: string;
        refreshToken: string;
    };
}

export type StudentSignUpInput = {
    username: string;
    email: string;
    phone: number | string;
    password: string;
    role?: string;
    studiedHours?: number;
    isVerified?: boolean;
}