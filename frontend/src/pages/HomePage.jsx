import React, { useEffect } from "react";
import { Container, Box, Text, Tabs,} from "@chakra-ui/react";
import Login from "../compo/Authontication/Login";
import SignUp from "../compo/Authontication/SignUp";
import { useNavigate } from "react-router-dom";


const HomePage = () => {

  const navigate = useNavigate();
  
  useEffect(()=>{
    const user = JSON.parse(localStorage.getItem("userInfo"));
    if(user){
      navigate("chats");
    }
  },[navigate]);

  return (
    <Container maxW="xl" centerContent>
      <Box
        d="flex"
        justifyContent="center"
        alignItems="center"
        p={3}
        bg={"white"}
        w="100%"
        m="40px 0 15px 0"
        borderRadius="lg"
        borderWidth="1px"
      >
        <Text
          justifySelf={"center"}
          fontFamily="work sans"
          fontSize="4xl"
          color="black"
        >
          Talk-a-Tive
        </Text>
      </Box>
      <Box bg={"white"} w="100%" p={4} borderRadius="lg" borderWidth="1px">
        <Tabs.Root variant="enclosed"  maxW="100%" defaultValue="login">
          
          <Tabs.List bg="white" w="100%" d="flex" justifyContent="space-evenly">
            <Tabs.Trigger  w="50%" value="login">Login</Tabs.Trigger>
            <Tabs.Trigger w="50%" value="signup">signup</Tabs.Trigger>
          </Tabs.List>

          {/* Tab Content */}
          <Tabs.Content color="black" value="login">
            <Login/>
          </Tabs.Content>
          <Tabs.Content color="black" value="signup">
              <SignUp/>
          </Tabs.Content>
        </Tabs.Root>
      </Box>
    </Container>
  );
};

export default HomePage;
