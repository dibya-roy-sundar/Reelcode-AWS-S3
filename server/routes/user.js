const express=require('express');
const { isLoggedIn } = require('../utils/isLoggedin.js');
const catchAsync = require('../utils/catchAsync');
const { register, sendOtp, login, logout, completeProfile, changePassword, changeUsername, getPresignedUrl, deleteAvatar } = require('../controllers/user.js');

const router=express.Router({mergeParams:true});



router.route('/send-otp').post(catchAsync(sendOtp));
router.route('/register').post(catchAsync(register));
router.route('/change-username').put(catchAsync(isLoggedIn), catchAsync(changeUsername));
// same route used for check unique username also
router.route('/get-presigned-url').get(catchAsync(isLoggedIn),catchAsync(getPresignedUrl));
router.route('/delete-avatar').post(catchAsync(isLoggedIn),catchAsync(deleteAvatar));
router.route('/complete-profile').put(catchAsync(isLoggedIn), catchAsync(completeProfile));
 // same route used for update profile also
router.route('/login').post(catchAsync(login));
router.route('/logout').get(catchAsync(isLoggedIn),catchAsync(logout));
router.route('/change-pw').post(catchAsync(isLoggedIn),catchAsync(changePassword));


module.exports=router