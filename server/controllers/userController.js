import UserModel from "../models/userModel.js";
import { catchAsyncModels } from "../middleware/catchAsyncErrors.js";
import ErrorHandler from "../ultils/errorhander.js";
import { sendToken } from "../ultils/jwtAndCookie.js";
import { sendEmail } from "../ultils/sendEmail.js";
import crypto from "crypto";
import cloudinary from "cloudinary";

export const registerUser = catchAsyncModels(
    async (req, res, next) => {
        const myCloudinary = await cloudinary.v2.uploader.upload(req.body.avatar, {
            folder : "avatars", 
            width : 150, 
            crop : "scale"
        });
        const {name , password, email} = req.body;
        const user = await UserModel.create({
            name, email, password, 
            avatar : {
                public_id : myCloudinary.public_id,
                url : myCloudinary.secure_url
            }
        });
        sendToken(user, 201, res);
    }
)

export const sigInUser = catchAsyncModels(
    async (req, res, next) => {
        const {email, password} = req.body;
        if(!email || !password) {
            return next(new ErrorHandler("Please, enter email and password!", 400));
        };

        // vì trong userModel password có select : false; 
        // nếu muốn user trả về có password thì thêm select
        const user = await UserModel.findOne({ email }).select("+password");

        if(!user) {
            return next(new ErrorHandler("wrong credentials!", 401));
        };

        const isPasswordMatched = await user.comparePassword(password);
        
        if(!isPasswordMatched) {
            return next(new ErrorHandler("wrong credentials!", 401));
        };
        
        // set token jwt on cookie
        sendToken(user, 200, res);
    }
);

export const logOut = catchAsyncModels(
    async (req, res, next) =>{
        // set cookie = res , get cookie = req
        res.cookie("token", null, {
            expires: new Date(Date.now()),
            httpOnly: true
        });

        res.status(200).json({
            success: true,
            message : "Logged Out"
        });
    }
);

export const forgotPassword = catchAsyncModels(
    async (req, res, next) => {

        const user = await UserModel.findOne({ email : req.body.email});
        if(!user) {
            return next(new ErrorHandler("User not found!", 401));
        };
        // khi bấm vào forgot sẽ bắt đầu tạo token crypto
        const resetToken = user.getResetPasswordToken();

        await user.save({ validateBeforeSave : false });

        const resetPasswordUrl = 
            `${req.protocol}://${req.get("host")}/api/v1/password/reset/${resetToken}`;

        const message = `Please, enter your password reset token  :- \n\n ${resetToken} \n\nIf you have not requested this email then, please ignore it;`;

        try {
            // send token crypto in message options to gmail
            await sendEmail({
                email : user.email,
                subject : `Ecommerce password recovery`,
                message
            });

            res.status(200).json({
                success : true,
                message : `Email send to ${user.email} successfully !!`
            })
        } catch (error) {
            // trong quá trình tại mà có lỗi thì =>
            user.resetPasswordToken = undefined;
            user.resetPasswordExpire = undefined;
            await user.save({ validateBeforeSave : false });

            return next(new ErrorHandler(error.message, 500))
        }
    }
);

export const resetPassword = catchAsyncModels(
    async (req, res, next) => {
        // check token crypto
      
        const resetPasswordToken = crypto
            .createHash("sha256")
            .update(req.params.token)
            .digest("hex");

        // tìm kiến resetPasswordToken và expireToken, must gte date now
        const user = await UserModel.findOne({ 
            resetPasswordToken , 
            resetPasswordExpire : {$gte : Date.now()}
        });

        if(!user) {
            return next(new ErrorHandler("Reset password is valid token or token has been expired!", 400));
        };

        if( req.body.password !== req.body.confirmPasswod){
            return next(new ErrorHandler("Confirmation password is not correct !", 400));
        };

        // mk tự encode bởi bcrypto
        user.password = req.body.password;
        // khi thay đổi mật khẩu rồi thì set undefined resetPasswordToken,resetPasswordExpire
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save();

        sendToken(user, 200, res);
    }
);

// get details of user
export const userDetails = catchAsyncModels(
    async (req, res, next) => {
        const user = await UserModel.findById(req.user._id);
        if(!user) {
            return next(new ErrorHandler("Can not find user !", 400));
        };

        res.status(200).json({
            success: true,
            user
        });
    }
);

// update password : cần check oldpassword , và confirm password
export const updatePassword = catchAsyncModels(
    async (req, res, next) => {
        const user = await UserModel.findById(req.user.id).select("+password");
        if(!user) {
            return next(new ErrorHandler("Can not find user !", 400));
        };

        if(req.body.password !== req.body.confirmPasswod) {
            return next( new ErrorHandler("Confirm password is incorrect", 400));
        };

        const isMatchPassword = user.comparePassword(req.body.oldpassword);

        if(!isMatchPassword) {
            return next(new ErrorHandler("old password is not correct!", 400));
        }

        user.password = req.body.password;
        await user.save();
        sendToken(user, 200, res);
    }
);

// user
export const updateProfile = catchAsyncModels(
    async ( req, res, next ) => {
        const newUser = {
            name : req.body.name,
            email : req.body.email,
        };

        if(req.body.avatar) {
            const userz = await findById(req.user._id);
            const imgId = userz.avatar.public_id;
            
            // xóa ảnh củ có imgId
            await cloudinary.v2.uploader.destroy(imgId);
            
            // tạo mới
            const myCloudinary = await cloudinary.v2.uploader.upload(req.body.avatar, {
                folder : "avatars", 
                width : 150, 
                crop : "scale"
            });

            newUser.avatar = {
                public_id : myCloudinary.public_id,
                url : myCloudinary.secure_url
            };
        }

        const user = await UserModel.findByIdAndUpdate(req.user._id, newUser, { new : true,runValidators: true,});
        res.status(200).json({
            success : true,
            user
        });
    }
);

export const getAllUsers = catchAsyncModels(
    async (req, res, next) => {
        const users = await UserModel.find();
        
        res.status(200).json({
            users,
            success : true
        });
    }
);

// admin
export const getSingleUser =catchAsyncModels(
    async (req, res, next) => {
        const user = await UserModel.findById(req.params.id);
        if(!user) {
            return next(new ErrorHandler("Can not find user !", 400));
        };

        res.status(200).json({
            success: true,
            user
        });
    }
);

// admin
export const adminUpdate = catchAsyncModels(
    async ( req, res, next ) => {
        const newUser = {
            name : req.body.name,
            role : req.body.role
        };
    
        const user = await UserModel.findByIdAndUpdate(
            req.params.id,  
            { $set: newUser },
            {
                new : true
            }
        );
        res.status(200).json({
            success : true,
            user
        });
    }
);

// admin
export const deleteUser = catchAsyncModels(
    async(req, res, next) => {
        const user = await UserModel.findById(req.params.id);

        if(!user) {
            return next(new ErrorHandler("User doen't exist ;", 400) );
        };

        await user.remove();

        res.status(200).json({
            success: true,
            message: "User deleted successfully"
        });
    }
);