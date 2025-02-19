const express=require('express');
const { isLoggedIn } = require('../utils/isLoggedin.js');
const catchAsync = require('../utils/catchAsync');

const router=express.Router({mergeParams:true});



router.route('/register').post(catchAsync(register));
router.route('/send-otp').post(catchAsync(sendOtp));
router.route('/login').post(catchAsync(login));
// router.route('/complete-profile').put(catchAsync(isLoggedIn), upload.single('avatar'), catchAsync(completeProfile));
router.route('/logout').get(catchAsync(logout));


module.exports=router