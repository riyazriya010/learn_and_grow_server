"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminBaseRepository = void 0;
class AdminBaseRepository {
    constructor(model) {
        this.model = model;
    }
    getUsers() {
        return __awaiter(this, arguments, void 0, function* (page = 1, limit = 4) {
            try {
                const skip = (page - 1) * limit;
                const response = yield this.model
                    .find()
                    .skip(skip)
                    .limit(limit)
                    .sort({ createdAt: -1 });
                const totalCourses = yield this.model.countDocuments();
                if (!response || response.length === 0) {
                    const error = new Error('Users Not Found');
                    error.name = 'UsersNotFound';
                    throw error;
                }
                return {
                    courses: response,
                    currentPage: page,
                    totalPages: Math.ceil(totalCourses / limit),
                    totalCourses: totalCourses
                };
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    getMentors() {
        return __awaiter(this, arguments, void 0, function* (page = 1, limit = 4) {
            try {
                const skip = (page - 1) * limit;
                const response = yield this.model
                    .find()
                    .skip(skip)
                    .limit(limit)
                    .sort({ createdAt: -1 });
                const totalCourses = yield this.model.countDocuments();
                if (!response || response.length === 0) {
                    const error = new Error('Mentors Not Found');
                    error.name = 'MentorssNotFound';
                    throw error;
                }
                return {
                    courses: response,
                    currentPage: page,
                    totalPages: Math.ceil(totalCourses / limit),
                    totalCourses: totalCourses
                };
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    blockMentor(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Find the mentor by ID
                const mentor = yield this.model.findById(id).exec();
                // Check if the mentor exists
                if (!mentor) {
                    throw new Error('Mentor not found');
                }
                const mentorToUpdate = mentor;
                // Update the `isBlocked` field
                mentorToUpdate.isBlocked = true;
                // Save the updated mentor document
                const updatedMentor = yield mentor.save();
                // Return the updated mentor
                return updatedMentor;
            }
            catch (error) {
                // Log the error and rethrow it for further handling
                console.error('Error blocking mentor:', error);
                throw new Error('Failed to block mentor');
            }
        });
    }
    unBlockMentor(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const mentor = yield this.model.findById(id).exec();
                if (!mentor) {
                    throw new Error('Mentor not found');
                }
                const mentorToUpdate = mentor;
                mentorToUpdate.isBlocked = false;
                const updatedMentor = yield mentor.save();
                return updatedMentor;
            }
            catch (error) {
                console.error('Error Unblocking mentor:', error);
                throw new Error('Failed to Unblock mentor');
            }
        });
    }
    blockUser(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const updatedUser = yield this.model.findByIdAndUpdate(id, { isBlocked: true }, { new: true } // Return the updated document
                ).exec();
                if (!updatedUser) {
                    throw new Error('User not found');
                }
                return updatedUser;
            }
            catch (error) {
                console.error('Error blocking User:', error);
                throw new Error('Failed to block User');
            }
        });
    }
    unBlockUser(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const updatedUser = yield this.model.findByIdAndUpdate(id, { isBlocked: false }, { new: true } // Return the updated document
                ).exec();
                if (!updatedUser) {
                    throw new Error('User not found');
                }
                return updatedUser;
            }
            catch (error) {
                console.error('Error Unblocking User:', error);
                throw new Error('Failed to Unblock User');
            }
        });
    }
    /* ---------------------------------- WEEK - 2 ----------------------------*/
    addCategory(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const isExist = yield this.model.findOne({ categoryName: data });
                if (isExist) {
                    const error = new Error('Category Already Exist');
                    error.name = 'categoryAlreadyExist';
                    throw error;
                }
                const categoryData = {
                    categoryName: data
                };
                const document = new this.model(categoryData);
                const savedCategory = yield document.save();
                return savedCategory;
            }
            catch (error) {
                throw error;
            }
        });
    }
    editCategory(categoryName, categoryId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const isExist = yield this.model.findOne({
                    categoryName: categoryName,
                    _id: { $ne: categoryId },
                });
                if (isExist) {
                    const error = new Error("Category Already Exists");
                    error.name = "CategoryAlreadyExistsError";
                    throw error;
                }
                const updatedCategory = yield this.model.findByIdAndUpdate(categoryId, { $set: { categoryName: categoryName } }, { new: true } // Specify options outside the update object
                );
                if (!updatedCategory) {
                    const error = new Error("Category Not Found");
                    error.name = "CategoryNotFoundError";
                    throw error;
                }
                return updatedCategory;
            }
            catch (error) {
                throw error; // Ensure errors are rethrown for higher-level handling
            }
        });
    }
    unListCategory(categoryId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const unListedCategory = yield this.model.findByIdAndUpdate(categoryId, { isListed: false }, { new: true });
                return unListedCategory;
            }
            catch (error) {
                throw error;
            }
        });
    }
    listCategory(categoryId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const unListedCategory = yield this.model.findByIdAndUpdate(categoryId, { isListed: true }, { new: true });
                return unListedCategory;
            }
            catch (error) {
                throw error;
            }
        });
    }
    getAllCategory() {
        return __awaiter(this, arguments, void 0, function* (page = 1, limit = 3) {
            try {
                const skip = (page - 1) * limit;
                const response = yield this.model
                    .find()
                    .skip(skip)
                    .limit(limit)
                    .sort({ createdAt: -1 });
                const totalCourses = yield this.model.countDocuments();
                if (!response || response.length === 0) {
                    const error = new Error('Category Not Found');
                    error.name = 'CategoryNotFound';
                    throw error;
                }
                return {
                    courses: response,
                    currentPage: page,
                    totalPages: Math.ceil(totalCourses / limit),
                    totalCourses: totalCourses
                };
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    getAllCourse() {
        return __awaiter(this, arguments, void 0, function* (page = 1, limit = 5) {
            try {
                const skip = (page - 1) * limit;
                const response = yield this.model
                    .find()
                    .skip(skip)
                    .limit(limit)
                    .sort({ createdAt: -1 });
                const totalCourses = yield this.model.countDocuments();
                if (!response || response.length === 0) {
                    const error = new Error('Course Not Found');
                    error.name = 'CoursesNotFound';
                    throw error;
                }
                return {
                    courses: response,
                    currentPage: page,
                    totalPages: Math.ceil(totalCourses / limit),
                    totalCourses: totalCourses
                };
            }
            catch (error) {
                throw error;
            }
        });
    }
    unListCourse(courseId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const updatedCourse = yield this.model.findByIdAndUpdate(courseId, { isListed: false }, { new: true });
                const getAllCourse = yield this.model.find();
                return getAllCourse;
            }
            catch (error) {
                throw error;
            }
        });
    }
    listCourse(courseId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const updatedCourse = yield this.model.findByIdAndUpdate(courseId, { isListed: true }, { new: true });
                const getAllCourse = yield this.model.find();
                return getAllCourse;
            }
            catch (error) {
                throw error;
            }
        });
    }
}
exports.AdminBaseRepository = AdminBaseRepository;
