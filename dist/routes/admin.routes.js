"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const admin_controller_1 = require("../controllers/admin.controller");
const express_1 = require("express");
const verifyToken_1 = __importDefault(require("../middleware/verifyToken"));
const student_controller_1 = require("../controllers/management/adminControllers/student.controller");
const mentor_controller_1 = require("../controllers/management/adminControllers/mentor.controller");
const course_controller_1 = require("../controllers/management/adminControllers/course.controller");
const category_controller_1 = require("../controllers/management/adminControllers/category.controller");
const badge_controller_1 = require("../controllers/management/adminControllers/badge.controller");
const sales_controller_1 = require("../controllers/management/adminControllers/sales.controller");
const router = (0, express_1.Router)();
//Amin Student Routes
router.post('/admin/login', student_controller_1.adminStudentController.adminLogin.bind(student_controller_1.adminStudentController));
router.get('/get/users', verifyToken_1.default, student_controller_1.adminStudentController.adminGetStudents.bind(student_controller_1.adminStudentController));
router.patch('/block/user', verifyToken_1.default, student_controller_1.adminStudentController.adminBlockStudent.bind(student_controller_1.adminStudentController));
router.patch('/unblock/user', verifyToken_1.default, student_controller_1.adminStudentController.adminUnBlockStudent.bind(student_controller_1.adminStudentController));
//Amin Mentor Routes
router.get('/get/mentors', verifyToken_1.default, mentor_controller_1.adminMentorController.adminGetMentors.bind(mentor_controller_1.adminMentorController));
router.patch('/block/mentor', verifyToken_1.default, mentor_controller_1.adminMentorController.adminBlockMentor.bind(mentor_controller_1.adminMentorController));
router.patch('/unblock/mentor', verifyToken_1.default, mentor_controller_1.adminMentorController.adminUnBlockMentor.bind(mentor_controller_1.adminMentorController));
//Admin Course Routes
router.get(`/get/all-course`, verifyToken_1.default, course_controller_1.adminCourseController.adminGetAllCourse.bind(course_controller_1.adminCourseController));
router.patch(`/unlist/course`, verifyToken_1.default, course_controller_1.adminCourseController.adminUnListCourse.bind(course_controller_1.adminCourseController));
router.patch(`/list/course`, verifyToken_1.default, course_controller_1.adminCourseController.adminListCourse.bind(course_controller_1.adminCourseController));
router.get('/get/non-approved/courses', verifyToken_1.default, course_controller_1.adminCourseController.adminNonApprovedCourse.bind(course_controller_1.adminCourseController));
router.get('/get/non-approved/course-details', verifyToken_1.default, course_controller_1.adminCourseController.adminNonApprovedCourseDetails.bind(course_controller_1.adminCourseController));
router.patch('/approve/course', verifyToken_1.default, course_controller_1.adminCourseController.adminApproveCourse.bind(course_controller_1.adminCourseController));
router.get('/get/wallet', verifyToken_1.default, course_controller_1.adminCourseController.adminGetWallet.bind(course_controller_1.adminCourseController));
//Admin Category
router.post(`/add/category`, verifyToken_1.default, category_controller_1.adminCategoryController.adminAddCategory.bind(category_controller_1.adminCategoryController));
router.patch(`/edit/category`, verifyToken_1.default, category_controller_1.adminCategoryController.adminEditCategory.bind(category_controller_1.adminCategoryController));
router.patch('/unList/category', verifyToken_1.default, category_controller_1.adminCategoryController.adminUnListCategory.bind(category_controller_1.adminCategoryController));
router.patch('/list/category', verifyToken_1.default, category_controller_1.adminCategoryController.adminListCategory.bind(category_controller_1.adminCategoryController));
router.get(`/get/categories`, verifyToken_1.default, category_controller_1.adminCategoryController.adminGetAllCategory.bind(category_controller_1.adminCategoryController));
//Admin Badge
router.post('/add/badge', badge_controller_1.adminBadgeController.adminAddBadge.bind(badge_controller_1.adminBadgeController));
router.patch('/edit/badge/:badgeId', badge_controller_1.adminBadgeController.adminEditBadge.bind(badge_controller_1.adminBadgeController));
router.get('/get/badges', badge_controller_1.adminBadgeController.adminGetBadges.bind(badge_controller_1.adminBadgeController));
//Admin Sales
router.get('/get/admin/dashboard', verifyToken_1.default, sales_controller_1.adminSalesController.adminDashboard.bind(sales_controller_1.adminSalesController));
router.get('/get/admin/chart/graph/data', verifyToken_1.default, sales_controller_1.adminSalesController.adminChartGraph.bind(sales_controller_1.adminSalesController));
router.get('/get/admin/report', verifyToken_1.default, sales_controller_1.adminSalesController.adminSalesReport.bind(sales_controller_1.adminSalesController));
const adminController = new admin_controller_1.AdminController();
//Student Routes
// router.post('/admin/login', adminController.adminLogin.bind(adminController))
// router.get('/get/users',authenticateToken, adminController.getUsers.bind(adminController))
// router.patch('/block/user',authenticateToken, adminController.blockUser.bind(adminController))
// router.patch('/unblock/user',authenticateToken, adminController.unBlockUser.bind(adminController))
//Mentor routes
// router.get('/get/mentors',authenticateToken, adminController.getMentors.bind(adminController))
// router.patch('/block/mentor',authenticateToken, adminController.blockMentor.bind(adminController))
// router.patch('/unblock/mentor',authenticateToken, adminController.unBlockMentor.bind(adminController))
/* -------------------------------------- WEEK -2 -----------------------------------*/
// router.post(`/add/category`,authenticateToken, adminController.addCategory.bind(adminController))
// router.patch(`/edit/category`,authenticateToken, adminController.editCategory.bind(adminController))
// router.patch('/unList/category',authenticateToken, adminController.unListCategory.bind(adminController))
// router.patch('/list/category',authenticateToken, adminController.listCategory.bind(adminController))
// router.get(`/get/categories`,authenticateToken, adminController.getAllCategory.bind(adminController))
// router.get(`/get/all-course`,authenticateToken, adminController.getAllCourse.bind(adminController))
// router.patch(`/unlist/course`,authenticateToken, adminController.unListCourse.bind(adminController))
// router.patch(`/list/course`,authenticateToken, adminController.listCourse.bind(adminController))
// router.get('/get/non-approved/courses', authenticateToken, adminController.adminNonApprovedCourse.bind(adminController))
// router.get('/get/non-approved/course-details', authenticateToken, adminController.adminNonApprovedCourseDetails.bind(adminController))
// router.get('/get/wallet',authenticateToken, adminController.getWallet.bind(adminController))
////////////////////////////// WEEK -3 ///////////////////
// router.post('/add/badge', adminController.addBadge.bind(adminController))
// router.patch('/edit/badge/:badgeId', adminController.editBadge.bind(adminController))
// router.get('/get/badges', adminController.getBadges.bind(adminController))
//////////////////////// WEEK - 4 ////////////////////////////
// router.get('/get/admin/dashboard', authenticateToken, adminController.adminDashboard.bind(adminController))
// router.get('/get/admin/chart/graph/data', authenticateToken, adminController.adminChartGraph.bind(adminController))
// router.get('/get/admin/report', authenticateToken, adminController.adminSalesReport.bind(adminController))
// router.patch('/approve/course', authenticateToken, adminController.adminApproveCourse.bind(adminController))
const adminRoutes = router;
exports.default = adminRoutes;
