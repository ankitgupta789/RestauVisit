import { Avatar, Box, Button, Drawer, DrawerBody, DrawerContent, DrawerHeader, DrawerOverlay, Input, Menu, MenuButton, MenuDivider, MenuItem, MenuList, Text, Tooltip, useDisclosure } from '@chakra-ui/react'
import React, { useState } from 'react'
// import NotificationBadge from "react-notification-badge";
import axios from 'axios'
import {BellIcon,ChevronDownIcon} from "@chakra-ui/icons"
import { ChatState } from '../../UserContext.js'
import ProfileModal from '../ProfileModal/ProfileModal.js'
import {  useNavigate } from 'react-router-dom';
import { useToast } from "@chakra-ui/toast";
import { Spinner } from "@chakra-ui/spinner";
import ListUser from '../ListUsers/ListUser'
import ChatLoading from '../animation/ChatLoading.js'
// import { Effect } from "react-notification-badge";

const SideBar = () => {

    const [search,setSearch]=useState()
    const [searchResult,setSearchResult]=useState([])
    const [loading,setLoading]=useState(false)
    const [chatLoading,setChatLoading]=useState(false)
    const navigate=useNavigate()

    const logoutHandler = () => {
        localStorage.clear();
        navigate('/')
      };

      
  const {
    setSelectedChat,
    user,
    chats,
    setChats,
  } = ChatState();

  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();


  const handleSearch = async () => {
    if (!search) {
      toast({
        title: "Please Enter something in search",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top-left",
      });
      return;
    }

    try {
      setLoading(true);

      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get(`http://localhost:4000/api/user?search=${search}`, config);
      console.log(data);
      setLoading(false);
      setSearchResult(data);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to Load the Search Results",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  const accessChat = async (userId) => {
    console.log("Chat will be fetched ",userId);

    try {
      setChatLoading(true);
      console.log(chatLoading)
      //as it has some json data so content type -application/json
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.post(`http://localhost:4000/api/community`, { userId }, config);
      console.log("SIde bar data post ",data);
      //if the chat is present  then just append it
      if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);
      setSelectedChat(data);
      setChatLoading(false);
      onClose();
    } catch (error) {
      toast({
        title: "Error fetching the chat",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
      setChatLoading(false)
      return;
    }
  };


  return (
    <>
    <Box
     display="flex"
     justifyContent="space-between"
     alignItems="center"
     bg="white"
     w="100%"
     p="5px 10px 5px 10px"
     borderWidth="5px"
    >
        <Tooltip label="Search for users" hasArrow placement='bottom-end'>
            <Button variant="ghost" onClick={onOpen}>
            <i className="fas fa-search"></i>
                Search Users
            </Button>
        </Tooltip>

        <Text fontSize="2xl" fontFamily="Work sans">
          Let's connect
        </Text>

        <Menu>
            <MenuButton 
            p={1}
            >
              {/* <NotifactionBadge/> */}
              
                <BellIcon 
                fontSize="2xl" 
                m={1}
                

                />
                
            </MenuButton>
        </Menu>

        <Menu>
            <MenuButton as={Button} rightIcon={<ChevronDownIcon/>}>
                <Avatar size="sm" cursor="pointer"  name={user.name} src={user.pic}/>

            </MenuButton>
            <MenuList>
                <ProfileModal user={user}>
                    <MenuItem>
                        My Profile
                        {
                          console.log("User from profile ",user)
                        }
                    </MenuItem>
                </ProfileModal>
                <MenuDivider/>
                <MenuItem onClick={logoutHandler}>
                    Logout
                </MenuItem>
            </MenuList>
        </Menu>


        


    </Box>

    <Drawer placement='left' onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay/>
        <DrawerContent>
            <DrawerHeader borderBottomWidth={"1px"} >
                Search  Users
            </DrawerHeader>

            <DrawerBody>
            <Box style={{display:"flex",paddingBottom:"1rem"}}>
              <Input
                placeholder="Search by name or email"
                mr={2}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Button onClick={handleSearch}>Go</Button>
            </Box>
            {loading ? (
              <ChatLoading />
            ) : (
              searchResult?.map((user) => (
                <ListUser
                  key={user?._id}
                  user={user}
                  handleFunction={()=>accessChat(user._id)}
                />
              ))
            )} 
            
            { chatLoading && <Spinner style={{display:"flex",margin:"0 auto"}} />}
          </DrawerBody>
        </DrawerContent>
    </Drawer>
    </>
  )
}

export default SideBar
