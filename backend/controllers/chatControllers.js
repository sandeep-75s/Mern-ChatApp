const asyncHandler = require("express-async-handler");
const Chat = require("../models/chatModel");
const User = require("../models/UserModel");



const accessChat = asyncHandler(async(req,res)=>{
    const {userId} = req.body;

    if(!userId){
        res.status(404).json({
            message:"userId params not sent with request"
        })
    }
    console.log(Chat);
    var isChat = await Chat.find({
        isGroupChat : false,
        $and:[
            {users: {$elemMatch: {$eq: req.user._id}}},
            {users: {$elemMatch: {$eq: userId}}},
        ],
    }).populate("users").populate("latestMessage").exec();
    
    isChat = await User.populate(isChat,{
        path : "latestMessage.sender",
        select : "name pic email"
    })

    if(isChat.length>0){
        res.send(isChat[0]);
    }else{
        var chatData = {
            chatName : "sender",
            isGroupChat : false,
            users: [req.user._id , userId]
        };
        
        try{
            const createdChat = await Chat.create(chatData);
            const fullChat = await Chat.findOne({_id:createdChat._id}).populate(
                "users",
                "-password",
            ).exec();

            res.status(200).send(fullChat);
        }catch(e){
            res.status(400).json({
                message : "chat could not access"
            });
        }
    }

});


const fetchChats = asyncHandler(async(req,res) => {
    try{
        Chat.find({users : {$elemMatch:{$eq:req.user._id}}})
        .populate("users", "-password")
        .populate("groupAdmin" , "-password")
        .populate("latestMessage")
        .sort({updated:-1})
        .then(async (results)=>{
            results = await User.populate(results, {
                path:"latestMessage.sender",
                select : "name email pic"
            });
            res.status(200).send(results);
        });
        
    }catch(e){
        res.status(400).json({
            message:`${e.message}`
        });

    }
});


const createGroupChat = asyncHandler(async(req,res)=>{
    if(!req.body.users || !req.body.name){
        return res.status(400).send({
            message: "please fill all the details"
        });
    }

    var users = JSON.parse(req.body.users);
    if(users.length<2){
        return res
            .status(400)
            .send("more than 2 user must required to form a group chat");
    }

    users.push(req.user);

    try{
        const groupChat = await Chat.create({
            chatName : req.body.name,
            users : users,
            isGroupChat : true,
            groupAdmin : req.user
        });

        const fullGroupChat = await Chat.findOne({
            _id : groupChat._id
        })
            .populate("users","-password")
            .populate("groupAdmin","-password")
            .exec();

        res.status(200).json({fullGroupChat});
    }catch(e){
        res.status(400).json({
            message : `${e.message}`
        });
    }
});


const renameGroup = asyncHandler(async (req,res) => {
    const {chatId , chatName} = req.body;

    const updatedChat = await Chat.findByIdAndUpdate(
        chatId,
        {
            chatName,
        },
        {
            new:true,
        }
    )
    .populate("users","-password")
    .populate("groupAdmin","-password")
    .exec()

    if(!updatedChat){
        res.status(400).json({
            message : "Chat Not Found",
        });
    }else{
        res.send(updatedChat);
    }
})


const addToGroup = asyncHandler(async(req,res) => {
    const {chatId , userId} = req.body;

    const added = await Chat.findByIdAndUpdate(
        chatId,
        {
            $push :{users : userId},
        },
        {new:true}
    )
    .populate("users", "-password")
    .populate("groupAdmin" , "-password")
    .exec();

    if(!added){
        res.status(400).json({
            message: "Chat Not Found"
        });
    }else{
        res.status(200).json(added);
    }
});


const removeFromGroup = asyncHandler(async(req,res) => {
    const {chatId , userId} = req.body;

    const removed = await Chat.findByIdAndUpdate(
        chatId,
        {
            $pull :{users : userId},
        },
        {new:true}
    )
    .populate("users", "-password")
    .populate("groupAdmin" , "-password")
    .exec();

    if(!removed){
        res.status(400).json({
            message: "Chat Not Found"
        });
    }else{
        res.status(200).json(removed);
    }
});






module.exports = {accessChat , fetchChats , createGroupChat , renameGroup , addToGroup , removeFromGroup};