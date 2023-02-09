import mongoose from "mongoose";
import validator from 'validator';
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";

const userSchema = new mongoose.Schema({
    name : {
        type : String,
        required : [true , "Please Enter Your Name"],
        maxLength : [30, "Name can not exceed 30 characters"],
        minlength : [4 , "Name should have more than 4 characters"]
    },
    email : {
        type : String,
        required : [true, "Please Enter Your Email"],
        unique : true,
        validate : [validator.isEmail, "Please Enter a valid email"],
    },
    password : {
        type : String,
        required : [true, "Please Enter Your Password"],
        minLength : [8 , "Password should be greater than 8 characters "],
        select : false
    },
    avatar : {
        public_id : {
            type : String,
            required : true,
        },
        url : {
            type : String,
            required : true,
        }
    },
    role : {
        type : String,
        default : "user"
    },
    resetPasswordToken : String,
    resetPasswordExpire: Date
},
{
    timestamps: true
});

// save là event của class schema, không sử dụng được func es6
// encript password
userSchema.pre("save", async function(next) {
    if(!this.isModified("password")){
        next();
    };
    this.password = await bcrypt.hash(this.password, 10);
});

// custom method : JWT TOKEN
userSchema.methods.getJWTOKEN = function(){
    return jwt.sign({
        id : this._id,
    }, process.env.JWT_SECRET, {
        expiresIn : process.env.JWT_EXPIRE
    });
};

// compare (decript) password
// this.password is secret được gọi đến từ this như user ở userController
userSchema.methods.comparePassword = async function(enteredpassword) {
    return await bcrypt.compare(enteredpassword, this.password);
};

// generating password reset token 
// nodejs có sẵn crypto
userSchema.methods.getResetPasswordToken = function(){
    // generating token
    const resetToken = crypto.randomBytes(20).toString("hex");

    // hashing and adding resetPasswordToken to userSchema
    
    this.resetPasswordToken = crypto
            .createHash("sha256")
            .update(resetToken)
            .digest("hex");
    this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;
    
    return resetToken;
};

export default mongoose.model('User', userSchema);