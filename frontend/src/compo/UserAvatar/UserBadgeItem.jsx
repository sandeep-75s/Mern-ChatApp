import { Box, } from '@chakra-ui/react'
import React from 'react'
import { IoCloseSharp } from "react-icons/io5";


const UserBadgeItem = ({user,handleFunction,selectedChat}) => {
  return (
    <Box
    display="flex"
    px={2}
    justifyContent="center"
    alignItems="center"
    py={1}
    borderRadius="lg"
    m={1}
    variant="solid"
    fontSize="sm"
    backgroundColor="purple"
    color="white"
    cursor="pointer"
    onClick={handleFunction}
    gap={1}
    >
        {
           selectedChat?.groupAdmin?._id !== user._id ? (user.name) : (user.name +"-Admin")
        }
        <IoCloseSharp/>
    </Box>
  )
}

export default UserBadgeItem
