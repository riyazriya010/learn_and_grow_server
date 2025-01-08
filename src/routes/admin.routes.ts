import { Router } from "express";
import { AdminController } from "../controllers/admin.controller";
import authenticateToken from "../middleware/verifyToken";

const router = Router()
const adminController = new AdminController()


router.post('/admin/login', adminController.adminLogin.bind(adminController))

// student routes
router.get('/get/users', adminController.getUsers.bind(adminController))
router.patch('/block/user',authenticateToken, adminController.blockUser.bind(adminController))
router.patch('/unblock/user',authenticateToken, adminController.unBlockUser.bind(adminController))

//mentor routes
router.get('/get/mentors', adminController.getMentors.bind(adminController))
router.patch('/block/mentor',authenticateToken, adminController.blockMentor.bind(adminController))
router.patch('/unblock/mentor',authenticateToken, adminController.unBlockMentor.bind(adminController))


/* -------------------------------------- WEEK -2 -----------------------------------*/

router.post(`/add/category`, adminController.addCategory.bind(adminController))
router.patch(`/edit/category`, adminController.editCategory.bind(adminController))
router.patch('/unList/category', adminController.unListCategory.bind(adminController))
router.patch('/list/category', adminController.listCategory.bind(adminController))

router.get(`/get/categories`, adminController.getAllCategory.bind(adminController))
router.get(`/get/all-course`, adminController.getAllCourse.bind(adminController))
router.patch(`/unlist/course`, adminController.unListCourse.bind(adminController))
router.patch(`/list/course`, adminController.listCourse.bind(adminController))

router.get('/get/wallet', adminController.getWallet.bind(adminController))

const adminRoutes = router
export default adminRoutes;


