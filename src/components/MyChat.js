import React, { useEffect, useState } from 'react';
import { ChatState } from '../UserContext.js';
import { Box, Button, Stack, Text, useToast } from '@chakra-ui/react';
import axios from 'axios';
import ChatLoading from './animation/ChatLoading';
import { AddIcon } from '@chakra-ui/icons';
// import GroupChat from './GroupChat/GroupChat.js';
import { getSender } from './HelperFunc/logicFunc';
import GroupChatModal from './GroupChat/GroupChatModal';

const MyChat = ({ fetchAgain }) => {
  const { selectedChat, setSelectedChat, user, chats, setChats } = ChatState();
  const toast = useToast();
  const [loggedUser, setLoggedUser] = useState();
  console.log(chats);

  useEffect(() => {
    // fetching chats
    const fetchChats = async (req, res) => {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`
          }
        };

        const { data } = await axios.get("http://localhost:4000/api/community", config);
        console.log(data);
        if (!data) {
          res.status(404).json("error while fetching chats");
        }
        setChats(data);
      } catch (error) {
        toast({
          title: "Error Occurred!",
          description: "Failed to Load the chats",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom-left",
        });
      }
    };
    setLoggedUser(user);
    fetchChats();
  }, [user, setLoggedUser, toast, setChats, user?.token]);

  return (
    <Box
      d={{ base: selectedChat ? "none" : "flex", md: "flex" }}
      flexDir="column"
      alignItems="center"
      p={3}
      bg="white"
      h="80vh" // Adjusted to take full height of the container
      w={{ base: "100%", md: "31%" }}
      borderRadius="lg"
      borderWidth="1px"
    >
      <Box
        pb={4}
        px={3}
        w="100%"
        fontSize={{ base: "28px", md: "30px" }}
        fontFamily="Work sans"
        display="flex"
        justifyContent="space-between"
        alignItems="start"
      >
        My Chats
        <GroupChatModal>
          <Button
            display="flex"
            fontSize={{ base: "17px", md: "10px", lg: "18px" }}
            rightIcon={<AddIcon />}
          >
            New Group Chat
          </Button>
        </GroupChatModal>
      </Box>
      <Box
        flex="1"
        w="100%"
        h="70vh" // Set height for the scrollable area
        mb="100px"
        overflowY="auto"
        css={{
          '&::-webkit-scrollbar': {
            width: '6px',
          },
          '&::-webkit-scrollbar-thumb': {
            background: '#a0aec0',
            borderRadius: '10px',
          },
        }}
      >
        {chats ? (
          <Stack spacing={3} h="100%"> {/* Set height to ensure the Stack takes full height */}
            {chats.map((chat) => (
              <Box
                onClick={() => setSelectedChat(chat)}
                cursor="pointer"
                bg={selectedChat === chat ? "#38B2AC" : "#E8E8E8"}
                color={selectedChat === chat ? "white" : "black"}
                px={3}
                py={2}
                borderRadius="lg"
                key={chat._id}
              >
                <Text>
                  {!chat.isGroupChat ? getSender(loggedUser, chat.users) : chat.chatName}
                </Text>
                {chat.latestMessage && (
                  <Text fontSize="xs">
                    <b className='font-semibold'>
                      {chat.latestMessage.sender?.firstName}:
                    </b>
                    {chat.latestMessage.content.length > 50
                      ? chat.latestMessage.content.substring(0, 30) + " ...."
                      : chat.latestMessage.content}
                  </Text>
                )}
              </Box>
            ))}
          </Stack>
        ) : (
          <ChatLoading />
        )}
      </Box>
    </Box>
  );
};

export default MyChat;
