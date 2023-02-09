import ErrorHandler from "../ultils/errorhander.js";

// xử lý lỗi cho controllers khi vào next()
export const errorMiddleware = (err, req, res, next) =>{
    
    err.statusCode = err.statusCode || 500;
    err.message = err.message || "Internal Server Error";
    
    // Wrong mongodb _id error;
    if(err.name === "CastError"){
       /* but it doesn't work; */
        const message = `Resource not found. Invalid ${err.path};`;
        err = new ErrorHandler(message, 400);
    };

    // mongoose duplicate key error 
    if(err.code === 11000){
        const message = `Duplicate ${Object.keys(err.keyValue)} entered;`;
        err = new ErrorHandler(message, 400);
    };

    // Wrong Jsonwebtoken error
    if(err.name === "JsonWebTokenError"){
        const message = `Json Web Token is invalid, try again ;`;
        err = new ErrorHandler(message, 400);
    };

    // Wrong Jsonwebtoken expire
    if(err.name === "TokenExpiredError"){
        const message = `Json Web Token is expired, try again ;`;
        err = new ErrorHandler(message, 400);
    };


    res.status(err.statusCode).json({
        success: false,
        error : err.message
    })
}