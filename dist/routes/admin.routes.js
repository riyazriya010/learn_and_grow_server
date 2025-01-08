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
router.get('/get/users', adminController.getUsers.bind(adminController));
router.patch('/block/user', verifyToken_1.default, adminController.blockUser.bind(adminController));
router.patch('/unblock/user', verifyToken_1.default, adminController.unBlockUser.bind(adminController));
//mentor routes
router.get('/get/mentors', adminController.getMentors.bind(adminController));
router.patch('/block/mentor', verifyToken_1.default, adminController.blockMentor.bind(adminController));
router.patch('/unblock/mentor', verifyToken_1.default, adminController.unBlockMentor.bind(adminController));
/* -------------------------------------- WEEK -2 -----------------------------------*/
router.post(`/add/category`, adminController.addCategory.bind(adminController));
router.patch(`/edit/category`, adminController.editCategory.bind(adminController));
router.patch('/unList/category', adminController.unListCategory.bind(adminController));
router.patch('/list/category', adminController.listCategory.bind(adminController));
router.get(`/get/categories`, adminController.getAllCategory.bind(adminController));
router.get(`/get/all-course`, adminController.getAllCourse.bind(adminController));
router.patch(`/unlist/course`, adminController.unListCourse.bind(adminController));
router.patch(`/list/course`, adminController.listCourse.bind(adminController));
router.get('/get/wallet', adminController.getWallet.bind(adminController));
const adminRoutes = router;
exports.default = adminRoutes;
