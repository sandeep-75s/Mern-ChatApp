import { Box, Button, Text, Input } from "@chakra-ui/react";
import React, { useState } from "react";
import { FaSearch } from "react-icons/fa";
import { IoMdNotifications } from "react-icons/io";
import { ChatState } from "../../Context/ChatProvider";
import { useNavigate } from "react-router-dom";
import UserListItem from "../UserAvatar/UserListItem";
import { Spinner } from "@chakra-ui/react";
import {
  MenuContent,
  MenuItem,
  MenuRoot,
  MenuTrigger,
} from "../../components/ui/menu";
import ProfileModal from "./ProfileModal";
import toast from "react-hot-toast";
import {
  DrawerActionTrigger,
  DrawerBackdrop,
  DrawerBody,
  DrawerCloseTrigger,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerRoot,
  DrawerTitle,
  DrawerTrigger,
} from "../../components/ui/drawer";
import axios from "axios";
import ChatLoading from "../ChatLoading";
import { getSender } from "../../config/ChatLogics";
const SideDrawer = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState();
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState();
  const {
    user,
    setSelectedChat,
    chats,
    setChats,
    notification,
    setNotification,
  } = ChatState();

  const logoutHandler = () => {
    localStorage.removeItem("userInfo");
    toast.success("Logout Successfull");
    navigate("/login");
  };

  const BASE_URL =
    process.env.NODE_ENV === "production"
    ? "https://chatconnect-in5b.onrender.com"  // Replace with your deployed backend URL
    : "http://localhost:5000";
  const handleSearch = async () => {
    if (!search) {
      toast.error("Please type the user name for search");
      return;
    }
    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get(
        `${BASE_URL}/api/user?${search}`,
        config
      );
      setLoading(false);
      setSearchResult(data);
    } catch (e) {
      toast.error("Failed to search user");
    }
  };

  const accessChat = async (userId) => {
    try {
      setLoadingChat(true);
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.post(
        `${BASE_URL}/api/chat`,
        { userId },
        config
      );
      if (!chats.find((c) => c.id === data.id)) {
        setChats([data, ...chats]);
      }
      setSelectedChat(data);
      setLoading(false);
      // onclose(); /// yaha pe sir se different hai
      document.getElementById("closeModalButton").click();
    } catch (e) {
      toast.error("Fetching issue the chat");
    }
  };

  return (
    <Box>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        bg="white"
        w="100%"
        color="black"
        p="5px 10px 5px 10px"
        borderWidth="5x"
        borderColor="#0000ff"
      >
        <Box label="Search User to Chat" hasArrow placement="bottom-end">
          <DrawerRoot placement={"start"}>
            <DrawerBackdrop />
            <DrawerTrigger asChild>
              <Button bg="white.400" color="black" _hover={{ bg: "gray.200" }}>
                <FaSearch />
                <Text d={{ base: "none", md: "flex" }}>Search User</Text>
              </Button>
            </DrawerTrigger>
            <DrawerContent placement="" bg={"white"} color="black">
              <DrawerHeader>
                <DrawerTitle>Search User</DrawerTitle>
              </DrawerHeader>
              <DrawerBody>
                <Box display={"flex"}>
                  <Input
                    bg={"white"}
                    placeholder="Search by name or email"
                    mr={2}
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                  <Button _hover={{ bg: "gray.200" }} onClick={handleSearch}>
                    GO
                  </Button>
                </Box>
                {loading ? (
                  <ChatLoading />
                ) : (
                  searchResult?.map((user) => (
                    <UserListItem
                      key={user._id}
                      user={user}
                      handleFunction={() => accessChat(user._id)}
                    />
                  ))
                )}
                {loadingChat && <Spinner ml="auto" display="flex" />}
              </DrawerBody>
              <DrawerFooter>
                <DrawerActionTrigger asChild>
                  <Button id="closeModalButton" variant="outline">Cancel</Button>
                </DrawerActionTrigger>
              </DrawerFooter>
              <DrawerCloseTrigger />
            </DrawerContent>
          </DrawerRoot>
        </Box>
        <Text fontSize="2xl" fontFamily="Work-sans">
          ChatConnect
        </Text>

        <Box>
          <MenuRoot>
            <MenuTrigger asChild>
              <Button variant="solid" fontSize="3xl" position="relative">
                <IoMdNotifications fontSize="2xl" />
                {notification.length > 0 && (
                  <Box
                    position="absolute"
                    top="-2px"
                    right="-2px"
                    bg="red.600"
                    color="white"
                    fontSize="xs"
                    width="20px"
                    height="20px"
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    borderRadius="full"
                    animation="bounce 1s infinite"
                    border="2px solid white"
                  >
                    {notification.length}
                  </Box>
                )}
              </Button>
            </MenuTrigger>
            <MenuContent bg="white" colorSchema="black">
              {!notification.length && (
                <MenuItem color={"black"} _hover={{ bg: "gray.200" }}>
                  No new message
                </MenuItem>
              )}
              {notification.map((notif) => (
                <MenuItem
                  color={"black"}
                  _hover={{ bg: "gray.200" }}
                  key={notif._id}
                  onClick={() => {
                    setSelectedChat(notif.chat);
                    setNotification(
                      notification.filter((n) => n.chat._id !== notif.chat._id)
                    );
                  }}
                >
                  {notif.chat.isGroupChat
                    ? `New message in ${notif.chat.chatName}`
                    : `New message from ${getSender(user, notif.chat.users)}`}
                </MenuItem>
              ))}
            </MenuContent>
          </MenuRoot>
          <MenuRoot>
            <MenuTrigger asChild>
              <Button
                w="40px"
                h="40px"
                p={0}
                borderRadius="50%"
                overflow="hidden"
                bg="white.400"
                color="black"
                _hover={{ bg: "gray.200" }}
                marginRight={5}
              >
                <img
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover", // Ensures image covers the button properly
                  }}
                  src={user.pic}
                  alt="Userpic"
                />
              </Button>
            </MenuTrigger>
            <MenuContent bg="white" colorSchema="black">
              <ProfileModal user={user}></ProfileModal>

              <MenuItem
                display={"flex"}
                justifyContent={"center"}
                onClick={logoutHandler}
                color="black"
                _hover={{ bg: "gray.200" }}
                value="logout"
              >
                Logout
              </MenuItem>
            </MenuContent>
          </MenuRoot>
        </Box>
      </Box>
    </Box>
  );
};

export default SideDrawer;
