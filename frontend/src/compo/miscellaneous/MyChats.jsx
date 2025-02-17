
import axios from 'axios';
import { ChatState } from '../../Context/ChatProvider';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Box, Button, Stack, Text } from '@chakra-ui/react';
import { MdAdd } from "react-icons/md";
import ChatLoading from '../ChatLoading';
import { getSender } from '../../config/ChatLogics';
import GroupChatModal from './GroupChatModal';

const MyChats = ({fetchAgain}) => {
  const [loggedUser, setLoggedUser] = useState();
  const { user, selectedChat, setSelectedChat, chats, setChats } = ChatState();
  const BASE_URL = `http://localhost:5000`;
  console.log(GroupChatModal);
  const fetchChats = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user?.token}`
        },
      };
      const { data } = await axios.get(`${BASE_URL}/api/chat`, config);
      
      console.log("Fetched Chats:", data); // Debugging Log
      setChats(data);
    } catch (e) {
      toast.error("Failed to load the chat");
    }
  };

  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
    if(user){
      fetchChats();
    };
  },[fetchAgain, user]);

  return (
    <Box
      display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
      flexDir="column"
      alignItems="center"
      p={3}
      bg={"white"}
      w={{ base: "100%", md: "31%" }}
      borderRadius="lg"
      borderWidth="1px"
    >
      <Box
        w="100%"
        pb={3}
        px={3}
        fontSize={{ base: "28px", md: "30px" }}
        fontFamily="work-sans"
        display="flex"
        justifyContent="space-between"
        alignItems={"center"}
      >
        My Chats
        <GroupChatModal fetchChats={fetchChats}>
          <Button
            width={"auto"}
            display="flex"
            fontSize={{ base: "10px", md: "10px", lg: "17px" }}
            bg="gray.100"
            _hover={{ bg: "gray.200" }}
          >
            New Group Chat
            <MdAdd />
          </Button>
        </GroupChatModal>
      </Box>

      <Box
        display="flex"
        flexDir="column"
        p={3}
        bg="#F8F8F8"
        w="100%"
        h="100%"
        borderRadius="lg"
        overflowY="hidden"
      >
        {chats ? (
          <Stack overflow="scroll">
            {chats.map((chat) => {
              console.log("Chat Object:", chat); // Debugging Log
              console.log("Chat Users:", chat.users); // Check if users exist

              return (
                <Box
                  onClick={() => setSelectedChat(chat)}
                  cursor="pointer"
                  bg={selectedChat === chat ? "#38B2AC" : "#E8E8E8"}
                  color={selectedChat === chat ? "white" : "black"}
                  px={3}
                  py={3}
                  borderRadius="lg"
                  key={chat._id}
                >
                  <Text>
                    {!chat.isGroupChat && chat.users?.length >= 2
                      ? getSender(loggedUser, chat.users)
                      : chat.chatName}
                  </Text>
                </Box>
              );
            })}
          </Stack>
        ) : (
          <ChatLoading />
        )}
      </Box>
    </Box>
  );
};

export default MyChats;

