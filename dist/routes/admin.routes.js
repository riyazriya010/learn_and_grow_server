"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const admin_controller_1 = require("../controllers/admin.controller");
const verifyToken_1 = __importDefault(require("../middleware/verifyToken"));
const router = (0, express_1.Router)();
const adminController = new admin_controller_1.AdminController();
router.post('/admin/login', adminController.adminLogin.bind(adminController));
// student routes
router.get('/get/users', verifyToken_1.default, adminController.getUsers.bind(adminController));
router.patch('/block/user', verifyToken_1.default, adminController.blockUser.bind(adminController));
router.patch('/unblock/user', verifyToken_1.default, adminController.unBlockUser.bind(adminController));
//mentor routes
router.get('/get/mentors', verifyToken_1.default, adminController.getMentors.bind(adminController));
router.patch('/block/mentor', verifyToken_1.default, adminController.blockMentor.bind(adminController));
router.patch('/unblock/mentor', verifyToken_1.default, adminController.unBlockMentor.bind(adminController));
/* -------------------------------------- WEEK -2 -----------------------------------*/
router.post(`/add/category`, verifyToken_1.default, adminController.addCategory.bind(adminController));
router.patch(`/edit/category`, verifyToken_1.default, adminController.editCategory.bind(adminController));
router.patch('/unList/category', verifyToken_1.default, adminController.unListCategory.bind(adminController));
router.patch('/list/category', verifyToken_1.default, adminController.listCategory.bind(adminController));
router.get(`/get/categories`, verifyToken_1.default, adminController.getAllCategory.bind(adminController));
router.get(`/get/all-course`, verifyToken_1.default, adminController.getAllCourse.bind(adminController));
router.patch(`/unlist/course`, verifyToken_1.default, adminController.unListCourse.bind(adminController));
router.patch(`/list/course`, verifyToken_1.default, adminController.listCourse.bind(adminController));
router.get('/get/wallet', verifyToken_1.default, adminController.getWallet.bind(adminController));
////////////////////////////// WEEK -3 ///////////////////
router.post('/add/badge', adminController.addBadge.bind(adminController));
router.patch('/edit/badge/:badgeId', adminController.editBadge.bind(adminController));
router.get('/get/badges', adminController.getBadges.bind(adminController));
//////////////////////// WEEK - 4 ////////////////////////////
router.get('/get/non-approved/courses', verifyToken_1.default, adminController.adminNonApprovedCourse.bind(adminController));
router.get('/get/non-approved/course-details', verifyToken_1.default, adminController.adminNonApprovedCourseDetails.bind(adminController));
router.get('/get/admin/dashboard', verifyToken_1.default, adminController.adminDashboard.bind(adminController));
router.get('/get/admin/chart/graph/data', verifyToken_1.default, adminController.adminChartGraph.bind(adminController));
router.get('/get/admin/report', verifyToken_1.default, adminController.adminSalesReport.bind(adminController));
router.patch('/approve/course', verifyToken_1.default, adminController.adminApproveCourse.bind(adminController));
const adminRoutes = router;
exports.default = adminRoutes;
