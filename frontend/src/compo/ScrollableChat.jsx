import { Box, Text } from "@chakra-ui/react";
import { isLastFromSameSender } from "../config/ChatLogics";
import { ChatState } from "../Context/ChatProvider";
import React, { useEffect, useRef } from "react";
import "./style1.css";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
const ScrollableChat = ({ messages, showTyping }) => {
  const { user } = ChatState();
  const chatRef = useRef(null);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTo({
        top: chatRef.current.scrollHeight,
        behavior: "smooth", // Enables smooth scrolling
      });
    }
  }, [messages, showTyping]);

  return (
    <Box
      ref={chatRef}
      h="100%"
      overflowY="auto"
      display="flex"
      flexDir="column"
      p={1}
    >
      {messages &&
        messages.map((m, i) => (
          <Box
            key={m._id}
            display="flex"
            alignItems="center"
            justifyContent={
              m.sender._id === user._id ? "flex-end" : "flex-start"
            }
            mb={2}
          >
            {isLastFromSameSender(messages, i, user?._id) && (
              <Box
                w="30px"
                h="30px"
                p={0}
                borderRadius="50%"
                overflow="hidden"
                bg="white.400"
                color="black"
                _hover={{ bg: "gray.200" }}
                marginRight={0}
              >
                <img
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                  src={m?.sender?.pic}
                  alt="Userpic"
                />
              </Box>
            )}

            {/* Message Bubble */}
            <Text
              px={4}
              py={2}
              borderRadius="12px"
              maxWidth="75%"
              bg={m.sender._id === user._id ? "gray.300" : "green.300"}
              color="black"
              fontSize={{ base: "small", md: "lg", lg: "sm" }}
              marginLeft={
                isLastFromSameSender(messages, i, user?._id) ? "2" : "9"
              }
            >
              {m.content}
            </Text>
            {isLastFromSameSender(messages, i, user?._id) && (
              <Text fontSize="xs" color="gray.500" mt={1}>
                {new Date(m.createdAt).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </Text>
            )}
          </Box>
        ))}
      {showTyping && (
        <DotLottieReact
          src="https://lottie.host/54709898-5976-4496-b32d-1183fc230ca3/BGVWxWmIVA.lottie"
          loop
          autoplay
          style={{ width: 50, height: 30 }}
        />
      )}
    </Box>
  );
};

export default ScrollableChat;
