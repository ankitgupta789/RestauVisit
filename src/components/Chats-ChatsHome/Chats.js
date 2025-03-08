import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Box } from '@chakra-ui/react'
import MyChat from '.././MyChat.js'
import ChatBox from '../ChatDisplay/ChatBox.js'
import { ChatState } from '../../UserContext.js'
import SideBar from '../Header-SideBar/SideBar'
import Navbar from '../Navbar.js'
import { useToast } from '@chakra-ui/react';
import UserContext from '../../UserContext.js'
const Chats = () => {
  const [fetchAgain, setFetchAgain] = useState(true);
  const {user}=ChatState()

  const { setChats } = ChatState();
  const toast=useToast()

  useEffect(()=>{
    const fetchChats=async (req,res)=>{
     
      try {
          const config={
              headers:{
                  Authorization:`Bearer ${user.token}`
              }
          }

          const {data}=await axios.get("http://localhost:4000/api/community",config)
          console.log(data,"token",user.token)
          if(!data)
          {
              res.status(404).json("error while fetching chats")
          }
          // console.log("Data of chats ",data)
          setChats(data)
      } catch (error) {
          // toast({
          //     title: "Error Occured!",
          //     description: "Failed to Load the chats",
          //     status: "error",
          //     duration: 5000,
          //     isClosable: true,
          //     position: "bottom-left",
          //   });
          
      }
  }
  fetchChats()

  },[user?.token,setChats,toast,user])

  return (
    <div className='w-full h-full'>
      <UserContext/>
      {user && <SideBar/>} 
      <Box style={{display:"flex",padding:"10px",width:"100%",justifyContent:"space-between"}}>
        {user && <MyChat  fetchAgain={fetchAgain} />} 
        { user &&  <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain}  />}
      </Box>

    </div>
  )
}

export default Chats
