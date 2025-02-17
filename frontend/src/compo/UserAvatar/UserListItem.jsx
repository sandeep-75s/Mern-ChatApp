import { Box , Button , Text} from "@chakra-ui/react";
import React from "react";

const UserListItem = ({ user, handleFunction }) => {
  return (
    <Box
      onClick={handleFunction}
      cursor="pointer"
      bg="#E8E8E8"
      _hover={{
        background: "#38B2AC",
        color: "white",
      }}
      w="100%"
      display="flex"
      alignItems="center"
      color="black"
      px={3}
      py={2}
      mb={2}
      mt={2}
      borderRadius="lg"
    >
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
        <Box>
            <Text>{user.name}</Text>
            <Text>{user.email}</Text>
        </Box>
    </Box>
  );
};

export default UserListItem;
