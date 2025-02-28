////////////////////////////// WEEK - 1 ///////////////////////////
export type MentorSignUpInput = {
    username: string;
    email: string;
    phone: string;
    password: string;
    expertise: string;
    skills: string;
}

export type MentorProfileUpdateInput = {
    username: string;
    phone: string;
    profilePicUrl: string;
}

////////////////////////////// WEEK - 2 ///////////////////////////
export type MentorEditCourseInput = {
    courseName: string;
    description: string;
    category: string;
    level: string;
    duration: string;
    price: string;
    demoVideo?: { [key: string]: any }
    thumbnailUrl?: string;
}

export type MentorAddChapterInput = {
    chapterTitle: string;
    courseId: string;
    description: string;
    videoUrl: string;
}

export type MentorEditChapterInput = {
    chapterTitle: string;
    description: string;
    chapterId: string;
    videoUrl: string;
}

export type MentorAddQuizInput = {
    question: string;
    option1: string;
    option2: string;
    correctAnswer: string;
}

export type mentorGetALlCourseOuput = {
    courses: any,
    currentPage: any,
    totalPages: any,
    totalCourses: any,
}

export type mentorFilterCourse = {
    courses: any,
    currentPage: any,
    totalPages: any,
    totalCourses: any,
}

export type mentorWalletOutput = {
    wallets: any,
    currentPage: any,
    totalPages: any,
    totalWallets: any,
}


//////////////////////// WEEK - 3 /////////////////////
export type MentorChatGetRoomsOutput = Array<{
    lastMessage?: string; // This is optional as `getRoom?.lastMessage` can be undefined
    studentData: {
      username: string;
      profilePicUrl: string;
      [key: string]: any; // Additional properties
    };
    mentorData: {
      username: string;
      [key: string]: any; // Additional properties
    };
  }>;