const express = require("express");
const chats = require("./data/data");
const dotenv = require("dotenv");
const PORT = process.env.PORT || 5000
const connectDB = require("./config/db");
const color = require("colors")
const userRoutes = require("./routes/userRoutes");
const cors = require("cors");
const chatRoutes = require("./routes/chatRoutes");
const messageRoutes = require("./routes/messageRoutes");
const path = require("path");
dotenv.config()
connectDB();
const app = express();
app.use(express.json());

app.use(cors({
    origin: 'http://localhost:3000', // Allow requests only from this origin
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Methods allowed
    credentials: true, // If you need to allow cookies/authentication
}));

app.use('/api/user',userRoutes);
app.use('/api/chat',chatRoutes);
app.use('/api/message',messageRoutes);



// --------------------Deployement-------------------------

const __dirname1 = path.resolve();
if(process.env.NODE_ENV==="production"){
    app.use(express.static(path.join(__dirname1,"/frontend/build")));

    app.get('*',(req,res) => {
        res.sendFile(path.resolve(__dirname1,"frontend","build","index.html"));
    })
}else{
    app.get("/",(req,res) => {
        res.send("API is running successfully");
    })
}



// --------------------Deployement-------------------------






app.get("/api/chats",(req,res)=>{
    res.send(chats);
})
const server = app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT} successfully` .yellow.bold);
});

const io = require("socket.io")(server,{
    pingTimeout : 60000,
    cors:{
        origin:"http://localhost:3000",
    },
});

io.on("connection", (socket)=>{
    console.log("connected to socket io")
    socket.on('setup',(userData)=>{
        socket.join(userData._id);
        console.log(userData._id);
        socket.emit('connected');
    });

    socket.on('join chat', (room)=>{
        socket.join(room);
        console.log("User Join room"+room);
    });

    socket.on("typing", (room)=>socket.in(room).emit("typing"));
    socket.on("stop typing", (room)=>socket.in(room).emit("stop typing"));

    socket.on('new message',(newMessageRecieved)=>{
        var chat = newMessageRecieved.chat;

        if(!chat.users){
            return console.log("chat user not define");
        }
        chat.users.forEach(user => {
            if(user._id == newMessageRecieved.sender._id ){
                return;
            }
            socket.in(user._id).emit("message recieved", newMessageRecieved)
        })
    })
    socket.off("setup",()=>{
        console.log("User disconnected");
        socket.leave(userData.id)
    })  
})