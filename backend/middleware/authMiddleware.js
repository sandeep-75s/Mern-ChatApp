const jwt = require("jsonwebtoken");
const User = require("../models/UserModel");
const asyncHandler = require("express-async-handler");
const dotenv = require("dotenv");
dotenv.config();
const protect = asyncHandler(async(req,res,next)=>{
    let token;
    if(
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
    ){
        try{
            token = req.headers.authorization.split(" ")[1];
            const decode = jwt.verify(token,process.env.JWT_SECRET);
            req.user = await User.findById(decode.id).select("-password");
            next();
        }catch(e){
            res.status(400).json({
                message : "Not authorized, token failed"
            });
        }
    }
    if(!token){
        res.status(400).json({
            message:"Token is not available"
        })
    }
});

module.exports = {protect}