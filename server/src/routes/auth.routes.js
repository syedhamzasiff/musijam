import express from 'express';
import {
    registerUser,
    loginUser,
    logoutUser,
    getCurrentUser,
    updateUserProfile,
    changePassword,
    forgotPassword,
    deleteUserAccount
} from '../controllers/auth.controller.js';  // Assuming your file is named `auth.controller.js`
import { verifyJWT } from '../middlewares/auth.middleware.js';  // Middleware for JWT verification

const router = express.Router();

// User Registration Route
router.route('/register').post(registerUser);

// User Login Route
router.route('/login').post(loginUser);

// User Logout Route (Requires authentication)
router.route('/logout').post(verifyJWT, logoutUser);

// Get Current User (Requires authentication)
router.route('/me').get(verifyJWT, getCurrentUser);

// Update User Profile (Requires authentication)
router.route('/update-profile').put(verifyJWT, updateUserProfile);

// Change Password (Requires authentication)
router.route('/change-password').put(verifyJWT, changePassword);

// Forgot Password Route (Publicly accessible)
router.route('/forgot-password').post(forgotPassword);

// Delete User Account (Requires authentication)
router.route('/delete-account').delete(verifyJWT, deleteUserAccount);

export default router;
