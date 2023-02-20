const express = require('express');
const router = express.Router();
const multer = require("multer");
const { sign, log, forgot, activating, logout,modifyMe,allUsers,deleteMe,getMe, resetPassword } = require("../controlers/userControler");
const authorize = require("../middleware/userMiddle")

const storage = multer.memoryStorage();
const profilePicUplaoder = multer({ storage })
//sign up 
router.post("/sign-up",profilePicUplaoder.single("profilePicture"),sign);
//activation
router.post("/verify", activating);
//log in
router.post("/log-in", log);
//forgoting password
router.post("/forgot-password", forgot);

//authorizer for protected routes 
router.use(authorize);
//modify user
router.put('/modify-me/:id',profilePicUplaoder.single('picture'),modifyMe)
//delete user
router.delete("/delete-me",deleteMe)
//all users
router.get("/users",allUsers);
//get me 
router.get("/get-me", getMe);
//reset pssword
router.post('/reset-password',resetPassword)
//logout
router.post("/log-out", logout);
module.exports = router;