const express = require('express');
const router = express.Router();
const auth = require('../.././../middleware/authMiddleware');
const validater=require('../../../middleware/validation/userValidation');
const { userLogin, userSignUp, userList, userProfileUpdate, getUserInfo, resetPassword, forgotPassword, verifyOtpByEmail, changePassword } = require('../../controller/userController');

// User Login Route
router.route("/api/userLogin").post(userLogin);

// User SignUp Route
router.post("/api/signup",validater.validateUser(),userSignUp);

// User List Route
router.route("/api/users").get(auth,userList);

// User Update Profile Route
router.route("/api/user/:id").put(auth,userProfileUpdate);

// User Profile Route 
router.route("/api/user/:id").get(auth,getUserInfo);

// User Forgot Password
router.route("/api/forgotPassword").post(forgotPassword);

// User Reset Password
router.route("/api/resetPassword").put(resetPassword);

// User change Password
router.route("/api/changePassword").put(changePassword);

// User verify Email
router.route("/api/verifyOtpByEmail/otp/:otp").get(verifyOtpByEmail)


module.exports = router; 
