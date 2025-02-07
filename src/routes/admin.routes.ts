import { Router } from "express";
import { AdminController } from "../controllers/admin.controller";
import authenticateToken from "../middleware/verifyToken";

const router = Router()
const adminController = new AdminController()


router.post('/admin/login', adminController.adminLogin.bind(adminController))

// student routes
router.get('/get/users',authenticateToken, adminController.getUsers.bind(adminController))
router.patch('/block/user',authenticateToken, adminController.blockUser.bind(adminController))
router.patch('/unblock/user',authenticateToken, adminController.unBlockUser.bind(adminController))

//mentor routes
router.get('/get/mentors',authenticateToken, adminController.getMentors.bind(adminController))
router.patch('/block/mentor',authenticateToken, adminController.blockMentor.bind(adminController))
router.patch('/unblock/mentor',authenticateToken, adminController.unBlockMentor.bind(adminController))


/* -------------------------------------- WEEK -2 -----------------------------------*/

router.post(`/add/category`,authenticateToken, adminController.addCategory.bind(adminController))
router.patch(`/edit/category`,authenticateToken, adminController.editCategory.bind(adminController))
router.patch('/unList/category',authenticateToken, adminController.unListCategory.bind(adminController))
router.patch('/list/category',authenticateToken, adminController.listCategory.bind(adminController))
router.get(`/get/categories`,authenticateToken, adminController.getAllCategory.bind(adminController))

router.get(`/get/all-course`,authenticateToken, adminController.getAllCourse.bind(adminController))
router.patch(`/unlist/course`,authenticateToken, adminController.unListCourse.bind(adminController))
router.patch(`/list/course`,authenticateToken, adminController.listCourse.bind(adminController))

router.get('/get/wallet',authenticateToken, adminController.getWallet.bind(adminController))

////////////////////////////// WEEK -3 ///////////////////
router.post('/add/badge', adminController.addBadge.bind(adminController))
router.patch('/edit/badge/:badgeId', adminController.editBadge.bind(adminController))
router.get('/get/badges', adminController.getBadges.bind(adminController))

//////////////////////// WEEK - 4 ////////////////////////////
router.get('/get/non-approved/courses', authenticateToken, adminController.adminNonApprovedCourse.bind(adminController))
router.get('/get/non-approved/course-details', authenticateToken, adminController.adminNonApprovedCourseDetails.bind(adminController))
router.get('/get/admin/dashboard', authenticateToken, adminController.adminDashboard.bind(adminController))
router.get('/get/admin/chart/graph/data', authenticateToken, adminController.adminChartGraph.bind(adminController))
router.get('/get/admin/report', authenticateToken, adminController.adminSalesReport.bind(adminController))
router.patch('/approve/course', authenticateToken, adminController.adminApproveCourse.bind(adminController))

const adminRoutes = router
export default adminRoutes;


