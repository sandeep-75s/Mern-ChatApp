import React, { useState } from "react";
import { Box } from "@chakra-ui/react";
import { Button, Input } from "@chakra-ui/react";
import { ChatState } from "../../Context/ChatProvider";
import { Field } from "../../components/ui/field";
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
import UserListItem from "../UserAvatar/UserListItem";
import { Spinner } from "@chakra-ui/react";
import toast from "react-hot-toast";
import UserBadgeItem from "../UserAvatar/UserBadgeItem";
import axios from "axios";




const UpdateGroupChatModal = ({ fetchAgain, setFetchAgain , fetchMessages }) => {
  const { user, selectedChat, setSelectedChat } = ChatState();
  const [groupChatName, setGroupChatName] = useState();
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [renameLoading, setRenameLoading] = useState(false);
  const BASE_URL =
    process.env.NODE_ENV === "production"
    ? "https://chatconnect-in5b.onrender.com"  // Replace with your deployed backend URL
    : "http://localhost:5000";



  const handleRemove = async(user1) => {
    if(selectedChat.groupAdmin._id !==user._id && user1._id !== user._id){
      toast.error("Only amin can remove someone!");
      return;
    }
    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.put(
        `${BASE_URL}/api/chat/groupremove`,{
          chatId : selectedChat._id,
          userId : user1._id,
        },
        config
      );
      user1._id === user._id ? setSelectedChat() : setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      fetchMessages();
      setLoading(false);
    } catch (e) {
      toast.error("Failed to remove the user server issue");
      return;
    }
  };
  const handleRename = async () => {
    console.log(groupChatName);
    if (!groupChatName) {
      toast.error("Please enter the group name");
      return;
    }
    try {
      console.log(groupChatName);
      setRenameLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.put(
        `${BASE_URL}/api/chat/rename`,
        {
          chatId: selectedChat._id,
          chatName: groupChatName,
        },
        config
      );
      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      setRenameLoading(false);
    } catch (e) {
      toast.error("Issue to update the chat name");
      setRenameLoading(false);
      return;
    }
    setGroupChatName("");
  };
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
    } catch (e) {
      toast.error("Error occur");
    }
  };

  const handleAddUser = async(user1)=>{
    if(selectedChat.users.some((u)=>u?._id === user1?._id)){
      toast.error("User already in group");
      return;
    }
    console.log(selectedChat);
    console.log(selectedChat.groupAdmin?._id + " " + user?._id);
    if(selectedChat.groupAdmin?._id !== user?._id){
      toast.error("Only admin can add someone!");
      return;
    }
    try{
      setLoading(true);
      const config ={
        headers:{
          Authorization : `Bearer ${user.token}`,
        },
      };
      const {data} = await axios.put(`${BASE_URL}/api/chat/groupadd`,
        {
          chatId : selectedChat._id,
          userId : user1._id,
        },
        config
      );
      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      setLoading(false);
    }catch(e){
      toast.error("Failed to add user server error");
      return;
    }
  }

  return (
    <div style={{ width: "", padding: "0" }}>
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
            textAlign="left"
            zIndex={"1000"}
            width="100%"
            variant="outline"
            size="sm"
          >
            Profile
          </Button>
        </DialogTrigger>
        <DialogContent p={5} bg="white" color="black">
          <DialogBody display={"flex"} flexDir={"column"} alignItems={"center"}>
            <DialogHeader p={0} m={0}>
              <DialogTitle
                fontSize="35px"
                fontFamily="work-sans"
                display="flex"
                justifyContent="center"
              >
                {selectedChat?.chatName}
              </DialogTitle>
            </DialogHeader>
            <Box display="flex" w="100%" flexWrap="wrap" pb={3}>
              {selectedChat.users.map((u) => (
                <UserBadgeItem
                  key={user._id}
                  user={u}
                  selectedChat={selectedChat}
                  handleFunction={() => handleRemove(u)}
                />
              ))}
            </Box>
            <Box display="flex" w="100%" alignItems="center">
              <Field label="Rename Group Name" required>
                <Input
                  type="text"
                  placeholder="Enter group name"
                  onChange={(e) => setGroupChatName(e.target.value)}
                />
              </Field>
              <Button
                variant="solid"
                colorScheme="teal"
                alignSelf="end"
                color="white"
                bg="#008080"
                ml={3}
                onClick={handleRename}
              >
                Update
              </Button>
            </Box>
            <Box display="flex" w="100%" alignItems="center" mt={1}>
              <Field label="Add New User">
                <Input
                  type="text"
                  placeholder="Enter user name or email"
                  onChange={(e) => handleSearch(e.target.value)}
                />
              </Field>
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
                      handleFunction={() => handleAddUser(user)}
                    />
                  ))
              )}
          </DialogBody>
          <DialogFooter>
            <DialogActionTrigger asChild>
              <Button
                variant="outline"
                bg="white.400"
                color="black"
                _hover={{ bg: "gray.200" }}
              >
                Cancel
              </Button>
            </DialogActionTrigger>
            <Button
              variant="solid"
              colorScheme="teal"
              alignSelf="end"
              color="white"
              bg="#FF1919"
              ml={3}
              onClick={() => handleRemove(user)}
            >
              Leave Group
            </Button>
          </DialogFooter>
          <DialogCloseTrigger />
        </DialogContent>
      </DialogRoot>
    </div>
  );
};

export default UpdateGroupChatModal;
