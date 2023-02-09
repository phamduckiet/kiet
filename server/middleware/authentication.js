// set cookie = res , get cookie = req
import UserModel from "../models/userModel.js";
import { catchAsyncModels } from "./catchAsyncErrors.js";
import jwt from "jsonwebtoken";
import ErrorHandler from "../ultils/errorhander.js";

export const isAuthenticated = catchAsyncModels(
    async (req, res, next) => {
        const { token } = req.cookies;
        
        if( !token ) return next(new ErrorHandler("you are not authenticated !!!", 401));
        const decode = jwt.verify(token, process.env.JWT_SECRET);

        req.user = await UserModel.findById(decode.id);
        next();
    }
);

export const role = (role) => (req, res, next) => {
    if( !role.includes( req.user.role ) ){
        return next(new ErrorHandler(`${req.user.role} is not authorizated`, 401));
    }

    next();
};
