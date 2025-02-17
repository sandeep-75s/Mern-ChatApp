const asyncHandler = require("express-async-handler");
const Message = require("../models/messageModel");
const User = require("../models/UserModel");
const Chat = require("../models/chatModel");

const sendMessage = asyncHandler(async(req,res)=> {
    const {content , chatId} = req.body;

    if(!content || !chatId){
        console.log("invalid data passed into request");
        return res.status(404).json({
            message : "invalid data passed into request"
        });
    }
    var newMessage = {
        sender : req.user._id,
        content : content,
        chat : chatId,
    };

    try{
        var message = await Message.create(newMessage);

        message = await message.populate("sender", "name pic");
        message = await message.populate("chat");
        message = await User.populate(message,{
            path:"chat.users",
            select: "name email pic",
        });

        await Chat.findByIdAndUpdate(req.body.chatId, {
            latestMessage : message,
        });

        res.json(message);

    }catch(e){
        return res.status(400).json({
            message : e.message,
        })
    }
});


const allMessages = asyncHandler(async(req,res) =>{
    try{
        const messages = await Message.find({chat:req.params.chatId})
        .populate("sender" , "name email pic")
        .populate("chat");
        res.json(messages);
    }catch(e){
        return res.status(400).json({
            message : e.message,
        });
    }
});


module.exports = {sendMessage , allMessages}