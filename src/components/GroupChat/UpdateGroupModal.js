import { Box, Button, FormControl, IconButton, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Spinner, useDisclosure, useToast } from '@chakra-ui/react'
import React, { useState } from 'react'
import ListUser from '../ListUsers/ListUser'
import UserItem from '../UserItem'
import axios from 'axios'
import { ViewIcon } from '@chakra-ui/icons'
import { ChatState } from '../../UserContext'

const UpdateGroupModal = ({fetchAgain,setFetchAgain,fetchMessages}) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [groupChatName, setGroupChatName] = useState();
    const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);
    const [renameloading, setRenameLoading] = useState(false);
    const BASE_URL=process.env.REACT_APP_BASE_URL;
    const toast = useToast();
  
    const { selectedChat, setSelectedChat, user } = ChatState();

    const handleRemove=async (user1)=>{
        //check whether present or not
        //check user is group admin or not
        //filter the group users after removing
        //fetch the chats again after removing a persom from the group
        console.log(selectedChat,search)
        if(selectedChat.groupAdmin._id !== user._id && user1._id!==user._id)
        {
            toast({
                title: "Only admins can remove someone!",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
              });
              return;
        }


        try{
            setLoading(true)
            const config={
                headers: {
                    Authorization: `Bearer ${user.token}`,
                  },
            }

            const {data}=await axios.put(`${BASE_URL}/api/community/remove`,{
                userId:user1._id,
                chatId:selectedChat._id 
            },config)

            user1._id===user._id?setSelectedChat():setSelectedChat(data)
            setLoading(false)
            setFetchAgain(!fetchAgain)
            fetchMessages()
        } catch (error) {
            toast({
                title: "Error Occured!",
                description: error.response?.data?.message,
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
              });
              setLoading(false);
        }
        setGroupChatName("");
    }

    const handleAddUser=async (user1)=>{
        //check whether present 
        //check whether only admin is adding 
        // if not present then add

        if(selectedChat.users.find((u)=>u._id===user1._id))
        {
            toast({
                title: "User Already in group!",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
              });
              return;
        }

        if(selectedChat.groupAdmin._id!==user._id)
        {
            toast({
                title: "Only admins can add someone!",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
              });
              return;
        }

        try {
            setLoading(true)

            const config = {
                headers: {
                  Authorization: `Bearer ${user.token}`,
                },
              };

              const {data}=await axios.put(`${BASE_URL}/api/community/add`,{
                chatId:selectedChat._id,
                userId:user1._id
              },config)

              setSelectedChat(data)
              setFetchAgain(!fetchAgain)
              setLoading(false)

        } catch (error) {
            toast({
                title: "Error Occured!",
                description: error.response?.data?.message,
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
              });
              setLoading(false);
        }
        setGroupChatName("")
    }

    const handleRename=async ()=>{
        if(!groupChatName)
        {
            return ;
        }

        try {
            setRenameLoading(true)
            const config={
                headers:{
                    Authorization: `Bearer ${user.token}`,
                }
            }

            const {data}=await axios.put(`${BASE_URL}/api/community/rename`,{
                chatId:selectedChat._id,
                chatName:groupChatName
            },config)
            
            console.log("data from rename grp ",data)

            setRenameLoading(false)
            setSelectedChat(data)
            setFetchAgain(!fetchAgain)

                      
        } catch (error) {
            toast({
                title: "Error Occured!",
                description: error.response.data.message,
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
              });
              setRenameLoading(false);
        }

        setGroupChatName("");
    }

    const handleSearch=async (search)=>{
        setSearch(search)
        console.log("Search result from update grp");
        if(!search)
        {
            return;
        }


        try {
            const config={
                headers:{
                    Authorization: `Bearer ${user.token}`,
                }
            }
            setLoading(true)

            const {data}=await axios.get(`${BASE_URL}/api/user?search=${search}`,config)
            
            if(!data)
            {
                console.log("data can't be searched from upadate grp")

            }

            setLoading(false)
            setSearchResult(data)
        } catch (error) {
            toast({
                title: "Error Occured!",
                description: "Failed to Load the Search Results",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom-left",
              });
              setLoading(false);
        }
    }

  return (
    <>
    <IconButton d={{ base: "flex" }} icon={<ViewIcon />} onClick={onOpen} />

    <Modal onClose={onClose} isOpen={isOpen} isCentered>
    <ModalOverlay />
    <ModalContent>
        <ModalHeader
        fontSize="35px"
        fontFamily="Work sans"
        display="flex"
        justifyContent="center"
        >
        {selectedChat.chatName}
        </ModalHeader>

        <ModalCloseButton />
        <ModalBody display="flex" flexDir="column" alignItems="center">
        <Box w="100%" display="flex" flexWrap="wrap" pb={3}>
            {selectedChat.users.map((u) => (
            <UserItem
                key={u._id}
                user={u}
                admin={selectedChat.groupAdmin}
                handleFunction={() => handleRemove(u)}
            />
            ))}
        </Box>
        <FormControl display="flex">
            <Input
            placeholder="Chat Name"
            mb={3}
            value={groupChatName}
            onChange={(e) => setGroupChatName(e.target.value)}
            />
            <Button
            variant="solid"
            colorScheme="teal"
            ml={1}
            isLoading={renameloading}
            onClick={handleRename}
            >
            Update
            </Button>
        </FormControl>
        <FormControl>
            <Input
            placeholder="Add User to group"
            mb={1}
            onChange={(e) => handleSearch(e.target.value)}
            />
        </FormControl>

        {loading ? (
            <Spinner size="lg" />
        ) : (
            searchResult?.map((user) => (
            <ListUser
                key={user._id}
                user={user}
                handleFunction={() => handleAddUser(user)}
            />
            ))
        )}
        </ModalBody>
        <ModalFooter>
        <Button onClick={() => handleRemove(user)} colorScheme="red">
            Leave Group
        </Button>
        </ModalFooter>
    </ModalContent>
    </Modal>

      
    </>
  )
}

export default UpdateGroupModal
