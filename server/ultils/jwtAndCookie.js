// create token and saving in cookie

export const sendToken = async (user, statusCode, res)=>{
    // getJWTOKEN is a method custom ở userModels
    const token = await user.getJWTOKEN();
   
    // options for cookies
    const options = {
        httpOnly: true,
        expires: new Date(Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000), 
    };
    res.cookie("token", token, options);
    res.status(statusCode).json({
        token,
        user,
        success: true
    });
};