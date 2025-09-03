import { Box, Button, FormControl, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Spinner, useDisclosure, useToast } from '@chakra-ui/react'
import React, { useState } from 'react'
import axios from 'axios'
import { ChatState } from '../../UserContext.js'
import UserItem from '../UserItem.js'
import ListUser from '.././ListUsers/ListUser.js'
const GroupChatModal = ({children}) => {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [groupChatName,setGroupChatName]=useState("")
 
    const [selectedUsers,setSelectedUsers]=useState([])
    const [loading,setLoading]=useState(false)
    const [searchResult,setSearchResult]=useState([])
    const toast=useToast()
    const BASE_URL=process.env.REACT_APP_BASE_URL;
    const {user,chats,setChats}=ChatState()

    const handlerSearch=async (search)=>{
        try {
            setLoading(true)
            console.log(user.token,search)
            const config = {
                headers: {
                  Authorization: `Bearer ${user.token}`,
                },
              };
        
              const { data } = await axios.get(`${BASE_URL}/api/user?search=${search}`, config);
            
            console.log(data);
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
              setLoading(false)
        }
    }

    const handleDelete=(U)=>{
        setSelectedUsers(selectedUsers.filter((u)=>u._id!==U._id))
    }

    const handleSubmit=async ()=>{

        if(!groupChatName||!selectedUsers)
        {
            toast({
                title: "Please fill all the feilds",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "top",
              });
              return;
        }

        try {
            const config={
                headers:{
                    Authorization:`Bearer ${user.token}`
                }
            }

            //upload the group formed to db
            // a post req
            const {data}=await axios.post(`${BASE_URL}/api/community/group`,{
                name:groupChatName,
                users:JSON.stringify(selectedUsers.map(u=>u._id))
            },config)

            console.log(data)

            setChats([data,...chats])
            onClose();

            toast({
                title: "New Group Chat Created!",
                status: "success",
                duration: 5000,
                isClosable: true,
                position: "bottom",
              });

            
        } catch (error) {
            toast({
                title: "Failed to Create the Chat!",
                description: error.response.data,
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
              });
        }
    }

    const handleGroup=(addedUser)=>{
        if(selectedUsers.includes(addedUser))
        {
            toast({
                title: "User already added",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "top",
              });
              return;
        }

        setSelectedUsers([...selectedUsers,addedUser])
    }

  return (
    <>
         <span onClick={onOpen}>{children}</span>

            <Modal 
            isOpen={isOpen} 
            onClose={onClose}
            >
            <ModalOverlay />
            <ModalContent>
                <ModalHeader
                 fontSize="35px"
                 fontFamily="Work sans"
                 display="flex"
                 justifyContent="center"
                >
                    Create Your Group
                </ModalHeader>
                <ModalCloseButton />
                <ModalBody
                display="flex" flexDir="column" alignItems="center"
                >
                    {/* form to fill the details of the grp name and members  */}
                      <FormControl>
                        <Input
                            placeholder="Group Name"
                            mb={3}
                            onChange={(e) => setGroupChatName(e.target.value)}
                        />
                    </FormControl>
                    <FormControl>
                    <Input
                        placeholder="Add Users Eg: ABC,John,Markus etc"
                        mb={1}
                        onChange={(e) => handlerSearch(e.target.value)}
                    />
                    </FormControl>
                    {/* box to show all the search results  */}
                    <Box>
                        {
                            selectedUsers.map((user)=>{
                                return (
                                    <UserItem
                                     key={user._id}
                                     user={user}
                                     handleFunction={()=>handleDelete(user)}
                                    />
                                )
                            })
                        }
                    </Box>
                    {/* If the chats are loading then show the loading animation  */}
                    {
                        loading ? <Spinner/>:(
                            //show the search results
                            searchResult?.slice(0,4).map((user)=>(
                                <ListUser
                                key={user._id}
                                user={user}
                                handleFunction={()=>handleGroup(user)}
                                />
                            ))
                        )
                    }

                </ModalBody>

                <ModalFooter>
                <Button variant='ghost' onClick={handleSubmit} colorScheme='blue'>Create Group Chat</Button>
                </ModalFooter>
            </ModalContent>
            </Modal>


      
    </>
  )
}

export default GroupChatModal
