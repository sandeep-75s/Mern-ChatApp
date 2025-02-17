const asyncHandler = require("express-async-handler");
const User = require("../models/UserModel");
const generateToken = require("../config/generateToken");
const bcrypt = require("bcryptjs");

const registerUser = asyncHandler(async (req,res) => {
    const {name , email , password , pic} = req.body
    if(!name || !email || !password){
        return res.status(400).json({
            message : "Please fill required field"
        })
    }
    console.log(name + email + password)
    const userExits = await User.findOne({email});
    if(userExits){
        return res.status(400).json({
            message: "User already registered"
        })
    }

    const newUser = await User.create({
        name,
        email,
        password,
        pic,
    });
    if(newUser){
        res.status(200).json({
            _id : newUser._id,
            name : newUser.name,
            email : newUser.email,
            pic : newUser.pic,
            token : generateToken(newUser._id),
        });
    }else{
        return res.status(400).json({
            message:"Faild to create new user"
        })
    }
});

const authUser = asyncHandler(async (req,res) => {
    const {email , password} = req.body;
    console.log("backend");
    console.log(email,password)
    const user = await User.findOne({email});
    // console.log(user);

    if(!user){
        return res.status(404).json({
            message:"User not found"
        });
    }
    const passwordchecking = await bcrypt.compare(password,user.password);
    // console.log(passwordchecking);
    if(!passwordchecking){
        return res.status(400).json({
            message:"Incorrect Password",
        });
    }else{
        return res.status(200).json({
            _id : user._id,
            name : user.name,
            email : user.email,
            pic : user.pic,
            token : generateToken(user._id),
        })
    }
    
});

const allUser = asyncHandler(async(req,res)=>{
    const keyboard = req.query.search
    ?{
        $or:[
            {name:{$regex: req.query.search , $options : "i"}},
            {email:{$regex: req.query.search , $options : "i"}},
        ],
    }
    :{};
    const users = (await User.find(keyboard).find({_id: {$ne : req.user._id}}));
    res.send(users);
    
})

module.exports = {registerUser , authUser , allUser}