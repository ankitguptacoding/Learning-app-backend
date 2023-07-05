const express = require('express');
const router = express.Router();
const auth = require('../../middleware/authMiddleware');
const { userLogin, userSignUp, userList, userProfileUpdate, getUserInfo } = require('../../controller/userController');

// User Login Route
router.route("/api/userLogin").post(userLogin);

// User SignUp Route
router.route("/api/signup").post(userSignUp);

// User List Route
router.route("/api/users").get(auth,userList);

// User Update Profile Route
router.route("/api/user/:id").put(auth,userProfileUpdate);

// User Profile Route 
router.route("/api/user/:id").get(auth,getUserInfo);

module.exports = router; 
