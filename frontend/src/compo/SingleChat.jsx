import { Box, Button, Spinner, Text, Input } from "@chakra-ui/react";
import { ChatState } from "../Context/ChatProvider";
import React, { useEffect, useState } from "react";
import { FaArrowLeft } from "react-icons/fa";
import { getSender, getSenderFull } from "../config/ChatLogics";
import ProfileModal from "./miscellaneous/ProfileModal";
import UpdateGroupChatModal from "./miscellaneous/UpdateGroupChatModal";
import { Field } from "../components/ui/field";
import axios from "axios";
import toast from "react-hot-toast";
import "./style.css";
import ScrollableChat from "./ScrollableChat";
import io from "socket.io-client"
const ENDPOINT = "http://localhost:5000";
var socket , selectedChatCompare;

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState();
  const { user, selectedChat, setSelectedChat , notification , setNotification} = ChatState();
  const [socketConnected , setSocketConnected] = useState(false);
  const [typing , setTyping] = useState(false);
  const [isTyping , setIsTyping] = useState(false);
  const [showTyping, setShowTyping] = useState(false);


  const BASE_URL =
    process.env.NODE_ENV === "production"
    ? "https://chatconnect-in5b.onrender.com"  // Replace with your deployed backend URL
    : "http://localhost:5000";
  const sendMessage = async (event) => {
    if ((event.key === "Enter" || event.type === "click") && newMessage) {
      socket.emit('stop typing',selectedChat._id);
      try {
        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        };
        const { data } = await axios.post(
          `${BASE_URL}/api/message`,
          {
            content: newMessage,
            chatId: selectedChat._id,
          },
          config
        );
        console.log(data);
        setNewMessage("");
        socket.emit('new message',data);
        setMessages([...messages, data]);
      } catch (e) {
        toast.error("message con't send server error");
      }
    }
  };

  const fetchMessages = async () => {
    if (!selectedChat) {
      return;
    }

    try {
      setLoading(true);
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get(
        `${BASE_URL}/api/message/${selectedChat._id}`,
        config
      );

      console.log(data);
      setMessages(data);
      setLoading(false);
      socket.emit('join chat',selectedChat._id)
    } catch (e) {
      toast.error("Issue while fetching the chat");
    }
  };

  const typingHandler = (e) => {
    setNewMessage(e.target.value);
    if(!socketConnected){
      return;
    }
    if(!typing){
      setTyping(true);
      socket.emit("typing",selectedChat._id);
    }
    let lastTypingTime = new Date().getTime();
    var timerLength =3000;
    setTimeout(()=>{
      var timeNow = new Date().getTime();
      var timeDiff = timeNow - lastTypingTime;
      if(timeDiff>=timerLength && typing){
        socket.emit("stop typing",selectedChat._id);
        setTyping(false);
      }
    },timerLength)
  };
  useEffect(()=>{
    socket = io(ENDPOINT);
    socket.emit("setup", user);
    socket.on('connected', ()=>{
      setSocketConnected(true);
    });
    socket.on("typing",()=>{
      setIsTyping(true);
      setShowTyping(true);
    })
    socket.on("stop typing",()=>{
      setIsTyping(false);
      setShowTyping(false);
    });

  },[])

  useEffect(() => {
    fetchMessages();
    selectedChatCompare = selectedChat
  }, [selectedChat]);

  useEffect(()=>{
    socket.on("message recieved",(newMessageRecieved)=>{
      if(!selectedChatCompare || selectedChatCompare._id !==newMessageRecieved.chat._id){
        if(!notification.includes(newMessageRecieved)){
          setNotification([newMessageRecieved, ...notification]);
          setFetchAgain(!fetchAgain);
        }
      }else{
        setMessages([...messages,newMessageRecieved])
      }
    })
  })

  return (
    <>
      {selectedChat ? (
        <>
          <Text
            fontSize={{ base: "28px", md: "30px" }}
            pb={3}
            px={1}
            width="100%"
            style={{ width: "100%" }}
            border
            fontFamily="work-sans"
            display="flex"
            justifyContent={{ base: "space-between" }}
            alignItems="center"
          >
            <Button
              display={{ base: "flex", md: "none" }}
              onClick={() => setSelectedChat("")}
            >
              <FaArrowLeft />
            </Button>
            {!selectedChat.isGroupChat ? (
              <>
                {getSender(user, selectedChat.users)}
                <ProfileModal user={getSenderFull(user, selectedChat.users)} />
              </>
            ) : (
              <>
                {selectedChat.chatName.toUpperCase()}
                <UpdateGroupChatModal
                  fetchAgain={fetchAgain}
                  setFetchAgain={setFetchAgain}
                  fetchMessages={fetchMessages}
                />
              </>
            )}
          </Text>
          <Box
            display="flex"
            flexDir="column"
            justifyContent="flex-end"
            p={3}
            bg="#E8E8E8"
            w="100%"
            h="100%"
            borderRadius="lg"
            overflowY="hidden"
          >
            {loading ? (
              <Spinner
                size="xl"
                w={20}
                h={20}
                alignSelf="center"
                margin="auto"
              />
            ) : (
              <div className="message">
                <ScrollableChat isTyping={isTyping} messages={messages} showTyping={showTyping} / >
              </div>
            )}
            <Box w="100%" display="flex" gap={2}>
              <Field onKeyDown={sendMessage} required>
                <Input
                  variant="filled"
                  bg="#E0E0E0"
                  placeholder="Enter a message...."
                  onChange={typingHandler}
                  value={newMessage}
                />
              </Field>
              <Button onClick={sendMessage}>Send</Button>
            </Box>
          </Box>
        </>
      ) : (
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          h="100%"
        >
          <Text fontSize="3xl" pb={3} fontFamily="work-sans">
            Click on a user to start chatting
          </Text>
        </Box>
      )}
    </>
  );
};

export default SingleChat;
