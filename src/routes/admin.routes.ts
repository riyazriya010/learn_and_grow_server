

import { Router } from "express";
import authenticateToken from "../middleware/verifyToken";
import { adminStudentController } from "../controllers/management/adminControllers/student.controller";
import { adminMentorController } from "../controllers/management/adminControllers/mentor.controller";
import { adminCourseController } from "../controllers/management/adminControllers/course.controller";
import { adminCategoryController } from "../controllers/management/adminControllers/category.controller";
import { adminBadgeController } from "../controllers/management/adminControllers/badge.controller";
import { adminSalesController } from "../controllers/management/adminControllers/sales.controller";
import authenticateBlackList from "../middleware/authenticate";


const router = Router()



//Amin Student Routes
router.post('/admin/login', adminStudentController.adminLogin.bind(adminStudentController))
router.get('/get/users',authenticateBlackList, authenticateToken, adminStudentController.adminGetStudents.bind(adminStudentController))
router.patch('/block/user',authenticateBlackList, authenticateToken, adminStudentController.adminBlockStudent.bind(adminStudentController))
router.patch('/unblock/user',authenticateBlackList, authenticateToken, adminStudentController.adminUnBlockStudent.bind(adminStudentController))
router.post('/admin/logout', adminStudentController.adminLogout.bind(adminStudentController))

//Amin Mentor Routes
router.get('/get/mentors',authenticateBlackList, authenticateToken, adminMentorController.adminGetMentors.bind(adminMentorController))
router.patch('/block/mentor',authenticateBlackList, authenticateToken, adminMentorController.adminBlockMentor.bind(adminMentorController))
router.patch('/unblock/mentor',authenticateBlackList, authenticateToken, adminMentorController.adminUnBlockMentor.bind(adminMentorController))

//Admin Course Routes
router.get(`/get/all-course`,authenticateBlackList, authenticateToken, adminCourseController.adminGetAllCourse.bind(adminCourseController))
router.patch(`/unlist/course`,authenticateBlackList, authenticateToken, adminCourseController.adminUnListCourse.bind(adminCourseController))
router.patch(`/list/course`,authenticateBlackList, authenticateToken, adminCourseController.adminListCourse.bind(adminCourseController))
router.get('/get/non-approved/courses',authenticateBlackList, authenticateToken, adminCourseController.adminNonApprovedCourse.bind(adminCourseController))
router.get('/get/non-approved/course-details',authenticateBlackList, authenticateToken, adminCourseController.adminNonApprovedCourseDetails.bind(adminCourseController))
router.patch('/approve/course',authenticateBlackList, authenticateToken, adminCourseController.adminApproveCourse.bind(adminCourseController))
router.get('/get/wallet',authenticateBlackList, authenticateToken, adminCourseController.adminGetWallet.bind(adminCourseController))



//Admin Category
router.post(`/add/category`,authenticateBlackList, authenticateToken, adminCategoryController.adminAddCategory.bind(adminCategoryController))
router.patch(`/edit/category`,authenticateBlackList, authenticateToken, adminCategoryController.adminEditCategory.bind(adminCategoryController))
router.patch('/unList/category',authenticateBlackList, authenticateToken, adminCategoryController.adminUnListCategory.bind(adminCategoryController))
router.patch('/list/category',authenticateBlackList, authenticateToken, adminCategoryController.adminListCategory.bind(adminCategoryController))
router.get(`/get/categories`,authenticateBlackList, authenticateToken, adminCategoryController.adminGetAllCategory.bind(adminCategoryController))


//Admin Badge
router.post('/add/badge',authenticateBlackList, authenticateToken, adminBadgeController.adminAddBadge.bind(adminBadgeController))
router.patch('/edit/badge/:badgeId',authenticateBlackList, authenticateToken, adminBadgeController.adminEditBadge.bind(adminBadgeController))
router.get('/get/badges',authenticateBlackList, authenticateToken, adminBadgeController.adminGetBadges.bind(adminBadgeController))


//Admin Sales
router.get('/get/admin/dashboard',authenticateBlackList, authenticateToken, adminSalesController.adminDashboard.bind(adminSalesController))
router.get('/get/admin/chart/graph/data',authenticateBlackList, authenticateToken, adminSalesController.adminChartGraph.bind(adminSalesController))
router.get('/get/admin/report',authenticateBlackList, authenticateToken, adminSalesController.adminSalesReport.bind(adminSalesController))









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

const adminRoutes = router
export default adminRoutes;


