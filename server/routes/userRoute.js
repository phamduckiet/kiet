import express from 'express';
import { registerUser, sigInUser, logOut, forgotPassword ,resetPassword , updatePassword ,userDetails , updateProfile , getAllUsers, getSingleUser, adminUpdate ,deleteUser } from "../controllers/userController.js";
import { isAuthenticated, role } from "../middleware/authentication.js";

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', sigInUser);   
router.get('/logout', logOut);
router.post("/password/forgot", forgotPassword);
router.put("/password/reset/:token", resetPassword);
router.put("/password/update/:id", isAuthenticated, updatePassword);

router.put("/me/profile/update", isAuthenticated, updateProfile);
router.get("/me", isAuthenticated, userDetails);
// admin
router.get('/admin/users', isAuthenticated, role(['admin']), getAllUsers);

router.route('/admin/user/:id')
    .get(isAuthenticated, role(['admin']), getSingleUser)
    .put(isAuthenticated, role(['admin']), adminUpdate)
    .delete(isAuthenticated, role(['admin']), deleteUser);
  
export default router;