import React, { useState } from "react";
import { Box, Input, Spinner } from "@chakra-ui/react";
import { Button } from "@chakra-ui/react";
import { useEffect } from "react";
import {
  DialogActionTrigger,
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
} from "../../components/ui/dialog";
import ChatLoading from "../ChatLoading";
import { Field } from "../../components/ui/field";
import { ChatState } from "../../Context/ChatProvider";
import axios from "axios";
import UserBadgeItem from "../UserAvatar/UserBadgeItem";
import toast from "react-hot-toast";
import UserListItem from "../UserAvatar/UserListItem";
const GroupChatModal = ({ children, fetchChats }) => {
  const [groupChatName, setGroupChatName] = useState();
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [search, setSearch] = useState();
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user, chats, setChats, setSelectedChat} = ChatState();
  const BASE_URL =
    process.env.NODE_ENV === "production"
    ? "https://chatconnect-in5b.onrender.com"  // Replace with your deployed backend URL
    : "http://localhost:5000";

  const handleSearch = async (query) => {
    setSearch(query);
    if (!query) {
      return;
    }
    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      // console.log("main hu data " +data);
      const { data } = await axios.get(
        `${BASE_URL}/api/user?search=${search}`,
        config
      );
      setLoading(false);
      setSearchResult(data);
      console.log(searchResult);
    } catch (e) {
      toast.error("Error occur");
    }
  };
  const handleGroup = (userToAdd) => {
    setSelectedUsers((prevUsers) => {
      if (!prevUsers.some((user) => user._id === userToAdd._id)) {
        return [...prevUsers, userToAdd];
      } else {
        toast.error("User Already selected");
        return prevUsers;
      }
    });
  };

  const handleDelete = (user) => {
    setSelectedUsers((prevUsers) =>
      prevUsers.filter((sel) => sel._id !== user._id)
    );
  };

  const handleSubmit = async () => {
    if (!groupChatName || !selectedUsers) {
      toast.error("please fill all the field");
      return;
    }
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.post(
        `${BASE_URL}/api/chat/group`,
        {
          name: groupChatName,
          users: JSON.stringify(selectedUsers.map((u) => u._id)),
        },
        config
      );
      setChats([data, ...chats]);
      fetchChats();
      toast.success("Group Created Successfully");
      setGroupChatName("");
      setSelectedUsers([]);  // Clear previous selected users
      setSearch("");         // Clear search input
      setSearchResult([]);
      setSelectedChat(data?.fullGroupChat)
      console.log(data,"Main hu data")
      document.getElementById("closeModalButton").click();
      
      
    } catch (e) {
      toast.error("failed to create the group server error");
    }
  };

  return (
    <div style={{ width: "auto", padding: "0" }}>
      <DialogRoot>
        <DialogTrigger
          asChild
          bg={"white"}
          outline={"none"}
          border={"none"}
          color={"black"}
          _hover={{ bg: "gray.200" }}
        >
          <Button
            p={0}
            m={0}
            textAlign="left"
            zIndex={"1000"}
            width="auto"
            variant="outline"
            size="sm"
          >
            {children}
          </Button>
        </DialogTrigger>
        <DialogContent p={5} bg="white" color="black">
          <DialogBody display={"flex"} flexDir={"column"} alignItems={"center"}>
            <DialogHeader
              fontSize={"35px"}
              fontFamily="work-sans"
              display="flex"
              justifyContent="center"
            >
              <DialogTitle>Create Group Chat</DialogTitle>
            </DialogHeader>
            <Field label="Group Name" required>
              <Input
                type="text"
                placeholder="Enter Group Name"
                onChange={(e) => setGroupChatName(e.target.value)}
                value={groupChatName}
              />
            </Field>
            <Field label="Search User" required>
              <Input
                type="text"
                placeholder="Enter User Name"
                onChange={(e) => handleSearch(e.target.value)}
                
              />
            </Field>

            <Box display="flex" mt={2} flexFlow={"wrap"} gap={1} w={"100%"}>
              {selectedUsers.map((u) => (
                <UserBadgeItem
                  key={user._id}
                  user={u}
                  handleFunction={() => handleDelete(u)}
                />
              ))}
            </Box>
            {loading ? (
              <Spinner mt={5} />
            ) : (
              searchResult
                ?.slice(0, 4)
                .map((user) => (
                  <UserListItem
                    key={user._id}
                    user={user}
                    handleFunction={() => handleGroup(user)}
                  />
                ))
            )}
          </DialogBody>
          <DialogFooter>
            <Button
              variant="outline"
              bg="white.400"
              color="black"
              _hover={{ bg: "gray.200" }}
              onClick={handleSubmit}
            >
              Create Group Chat
            </Button>
            <DialogActionTrigger asChild>
              <Button
                variant="outline"
                bg="white.400"
                color="black"
                _hover={{ bg: "gray.200" }}
                id="closeModalButton"
              >
                Cancel
              </Button>
            </DialogActionTrigger>
          </DialogFooter>
          <DialogCloseTrigger />
        </DialogContent>
      </DialogRoot>
    </div>
  );
};

export default GroupChatModal;
