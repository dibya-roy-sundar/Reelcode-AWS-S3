const ErrorHand = require("../utils/errorHand");
const sendjwtToken = require("../utils/sendjwtToken");
const bcrypt = require("bcrypt");
const otpGenerator = require('otp-generator')
const Otp = require("../models/otp.js");
const User = require("../models/user.js");
const { transporter } = require("../utils/Mailer.js");
const {MailTemplate}=require("../Mail/MailTemplate.js");
const s3 = require("../AWS/s3.js");
const { PutObjectCommand, DeleteObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");



module.exports.register = async (req, res, next) => {
    const { email, password, otp } = req.body;

    if (!(email || password || otp)) {
        return next(new ErrorHand("All fields are  required", 400));
    }

    const record = await Otp.findOne({ email });

    if (!record || (record?.expiresAt < new Date())) {
        return next(new ErrorHand("Invalid or expired OTP", 401));
    }

    const isMatch = await bcrypt.compare(otp, record.otp);

    if (!isMatch) {
        return next(new ErrorHand("Invalid  OTP", 401));
    }

    await Otp.deleteOne({ _id: record._id });


    //  email-checked , otp-verified

    const hash = await bcrypt.hash(password, 12);
    const user = new User({
        email,
        password: hash,
    });
    await user.save();

    sendjwtToken(user, 201, res);
};

module.exports.sendOtp = async (req, res, next) => {
    const { email } = req.body;


    const foundUser = await User.findOne({ email });

    if (foundUser) {
        return res.status(200).json({
            success: false,
            message: "Email already in use",
        });
    }




    const otp = otpGenerator.generate(6, { lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false });
    const expiresAt = new Date(Date.now() + process.env.OTP_EXPIRY * 1000);

    await Otp.deleteMany({ email }); //delete all previously generated otp - if user resend otp

    await Otp.create({ email, otp, expiresAt });

    try {
        await transporter.sendMail({
            from: process.env.SMTP_USER, // sender address
            to: email, // recipient address
            subject: `Your OTP Code is ${otp}`, // subject line
            html: MailTemplate(otp)
        });
        res.status(200).json({
            success: true,
            message: "verification code  sent to your email"
        })
        // console.log('OTP email sent');
    } catch (error) {
        console.error('Error sending OTP email:', error);
        res.status(500).json({
            success: false,
            message: "something went wrong while sending mail"
        })
    }

}

module.exports.completeProfile = async (req, res, next) => {
    const {
        username,
        name,
        bio = "",
        fileKey
    } = req.body;

    if(!username){
        return res.status(400).json({
            success:false,
            msg:"username is required"
        })
    }
    const lowUsername = username.toLowerCase();

    const availableUser = await User.findOne({ username: lowUsername });
    if (availableUser) {
        return next(new ErrorHand("username is not available", 400));
    }

    const user= await User.findById(req.user?._id).select("-password");

    if(user.avatar?.key?.length>0){
        const command=new DeleteObjectCommand({
            Bucket:process.env.AWS_S3_BUCKET_NAME,
            key:user.avatar?.key,
        })
    
        await s3.send(command);
    
    }

    user.username=lowUsername;
    user.name=name;
    user.bio=bio;
    const url= `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileKey}`
    user.avatar={
        url,
        key:fileKey
    }
    await user.save();
   

    res.status(200).json({
        status: "success",
        user,
        message: "profile completed",
    });
};


module.exports.login = async (req, res, next) => {
    const { userDetails, password } = req.body;

    if (!userDetails) {
        return next(new ErrorHand("Email or Username is required", 400));
    }

    const user = await User.findAndValidate(userDetails, password);

    if (!user) {
        return next(new ErrorHand("Invalid email or password", 404));
    }
    sendjwtToken(user, 200, res);
};

module.exports.logout = async (req, res, next) => {
    let options = {
        expires: new Date(
            Date.now() + 10 * 24 * 50 * 60 * 1000
        ),
        httpOnly: true,
        // sameSite: 'None',   //needed for cross origin
        secure: (process.env.NODE_ENV === 'production'),
        sameSite:'Lax', // only for testing
    }
    res.clearCookie('token',options);
    res.status(200).json({
        status: true,
        message: "Logged Out",
        // token: null,
        // cookieOptions: options,
    });
};

module.exports.changePassword = async (req, res, next) => {
    const { oldpw, newpw } = req.body;
    
  
    

    if (!oldpw.trim()) {
        if (!(req.user.googleId)) {
            return next(new ErrorHand("Old Password required", 401));
        }
    }
    else {
        const result = await bcrypt.compare(oldpw, req.user?.password);
        if (!result) {
            return next(new ErrorHand("Incorrect Password", 401));
        }
    }

   
    const hash = await bcrypt.hash(newpw, 12);
    await User.findByIdAndUpdate(
        req.user?._id,
        { password: hash },
        { new: true }
    );
    res.status(200).json({
        success: true,
        message: "Password Changed!",
    });

};

//   module.exports.forgotPassword =catchAsync( async (req, res) => {
//     const { oldpw,newpw } = req.body;
//     //current logged in userdetails
//     const user = await User.findOne({  username });
//     const result = await bcrypt.compare(oldpw , user.password);
//     if(!result){
//         //oldpw  doesn't match
//     }else{
//         const hash = await bcrypt.hash(newpw, 12);
//         await User.findOneAndUpdate({password:hash});
//     }

//   });



module.exports.changeUsername = async (req, res, next) => {
    const { username, save } = req.body;

    if (!username) {
        return res.status(400).json({
            success: false,
            msg: "username is required"
        })
    }
    const lowUsername = username.toLowerCase();

    const user = await User.findOne({ username: lowUsername });

    if (user) {
        return res.status(200).json({
            success: false,
            msg: "username is already taken"
        })
    } else {
        if (save) {
            if (req.user?.usernameChanged) {
                return res.status(400).json({
                    success: false,
                    msg: "change username limit crossed"
                })
            } else {
                req.user.username = lowUsername;
                req.user.usernameChanged = true;
                await req.user.save();

                return res.status(200).json({
                    success: true,
                    msg: "username updated successfully",
                    user: req.user
                })
            }
        } else {
            res.status(200).json({
                success: true,
                msg: "unique username",
                isnormal: username.length <= 18,
            })
        }
    }


}

module.exports.getPresignedUrl= async (req,res,next) =>{
    const { fileName, fileType } = req.query;

    if(!fileName || !fileType){
        return res.status(400).json({
            success:false,
            msg:"filename and filetype are required"
        })
    }

    const fileKey = `avatars/${Date.now()}-${fileName}`;
   
    const command=new PutObjectCommand({
        Bucket:process.env.AWS_S3_BUCKET_NAME,
        Key:fileKey,
        ContentType:fileType,
    })

    const presignedurl=await getSignedUrl(s3,command,{expiresIn:60}) //60 seconds

    if(!presignedurl){
        return res.satus(500).json({
            success:false,
            msg:"something went wrong while generating presigned url",
        })
    }

    res.status(200).json({
        success:true,
        presignedurl,
        fileKey
    })
}

module.exports.deleteAvatar=async (req,res,next) =>{
    const {fileKey}=req.body;
    if(!fileKey){
        return res.status(400).json({
            success:false,
            msg:"fileKey is required"
        })
    }

    const command=new DeleteObjectCommand({
        Bucket:process.env.AWS_S3_BUCKET_NAME,
        Key:fileKey,
    })

    await s3.send(command);

    res.status(200).json({
        success:true,
        msg:"avatar deleted sucessfully"
    })
}

