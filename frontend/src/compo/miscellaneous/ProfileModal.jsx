import React from 'react';
import { Box } from '@chakra-ui/react';
import { Button } from '@chakra-ui/react'
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
} from "../../components/ui/dialog"
const ProfileModal = ({user}) => {
  return (
    <div 
    style={{width:"", padding:"0"}}
    >
      <DialogRoot>
      <DialogTrigger asChild bg={"white"} outline={"none"} border={"none"} color={"black"} _hover={{ bg: "gray.200" }} >
        <Button textAlign="left" zIndex={"1000"} width="100%" variant="outline" size="sm">
          Profile
        </Button>
      </DialogTrigger>
      <DialogContent p={5} bg="white" color="black">
        <Box w={"100%"} h={"100%"} display={"flex"} justifyContent={"center"}>
          <Box w={"100px"} h={"100px"} borderRadius={"50%"} overflow="hidden" >
            <img style={{objectFit: "cover", width:"100%", height:"100%" }}  src={user.pic} alt="pic"/>
          </Box>
        </Box>
        <DialogBody  display={"flex"} flexDir={"column"} alignItems={"center"}>
          <DialogHeader p={0} m={0}>
            <DialogTitle>{user?.name}</DialogTitle>
          </DialogHeader>
          <p>
            {user?.email}
          </p>
        </DialogBody>
        <DialogFooter>
          <DialogActionTrigger asChild>
            <Button variant="outline" 
            bg="white.400"
            color="black"
            _hover={{ bg: "gray.200" }}
            >Cancel</Button>
          </DialogActionTrigger>
        </DialogFooter>
        <DialogCloseTrigger />
      </DialogContent>
    </DialogRoot>
    </div>
  )
}

export default ProfileModal
