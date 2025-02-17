import { ChatState } from '../Context/ChatProvider'
import { Box } from '@chakra-ui/react';
import React, { useState } from 'react'
import SideDrawer from '../compo/miscellaneous/SideDrawer';
import MyChats from '../compo/miscellaneous/MyChats';
import ChatBox from '../compo/miscellaneous/ChatBox';

function ChatPage() {
    const [fetchAgain , setFetchAgain] = useState(false);
    const {user} = ChatState();
    return (
        <div style={{ width: "100%", border: "1px solid black" }}>
            {user && <SideDrawer/>}
            <Box
            w="100%"
            display="flex"
            h="91.5vh"
            color="red"
            justifyContent="space-between" 
            border="1px solid green"
            p={5}
            
            >
                { user && <MyChats fetchAgain={fetchAgain} />} 
                { user && <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />} 
            </Box>
        </div>
    )
}

export default ChatPage
