const jwt = require('jsonwebtoken');
const User = require('../models/user.js');
const ErrorHand = require('./errorHand.js');


module.exports.isLoggedIn = async (req, res, next) => {
    // const {token} = req.cookies;
    // const token = req?.header("Authorization")?.replace("Bearer ", "");
    const token= req.cookies.token || req?.headers?.authorization?.split(' ')[1];

    
    if (!token) {
        return next(new ErrorHand("You need to log in first", 401));
    }
    const data = jwt.verify(token, process.env.JWT_SECRET);

    req.user = await User.findById(data.id);

    
    if(!req.user){
        return next(new ErrorHand("jwt token expired, login again", 401));
    }

    next();
}

