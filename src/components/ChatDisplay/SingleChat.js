import React, { useEffect, useState } from 'react'
import { ChatState } from '../../UserContext.js'
import { Box, FormControl, IconButton, Input, Spinner, Text, useToast } from '@chakra-ui/react'
import { ArrowBackIcon } from '@chakra-ui/icons'
import { getSender, getSenderFull } from '../HelperFunc/logicFunc.js'
import ProfileModal from '../ProfileModal/ProfileModal.js'
import UpdateGroupModal from '../GroupChat/UpdateGroupModal.js'
import axios from 'axios'
import MessagesComponent from '../MessageComponent/MessagesComponent.js'
import io from "socket.io-client";
import Lottie from 'react-lottie'

const AnimationData =require('../animation/AnimationData.json')
const ENDPOINT="http://localhost:4000"
var socket,selectedChatCompare;
// console.log(io)

const SingleChat = ({fetchAgain,setFetchAgain}) => {
    const {user,selectedChat,setSelectedChat,notification,setNotification}=ChatState()

    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [newMessage, setNewMessage] = useState("");
    const [socketConnected, setSocketConnected] = useState(false);
    const [typing, setTyping] = useState(false);
    const [istyping, setIsTyping] = useState(false);
    const toast = useToast();

    useEffect(()=>{
      socket=io(ENDPOINT)
      socket.emit("setup",user)
      socket.on("connected",()=>setSocketConnected(true))
      socket.on("typing",()=>setIsTyping(true))
      socket.on("stop typing",()=>setIsTyping(false))
       // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])

    useEffect(()=>{
      //this is to get all chats from the socket
      socket.on("Msg-recieved",(msg)=>{
        if( !selectedChatCompare||selectedChatCompare._id!==msg.chat._id )
        {
          if(!notification.includes(msg))
          {
             setNotification([msg,...notification])
             setFetchAgain(!fetchAgain)
          }
        }
        else
        {
          //set msg
          setMessages([...messages,msg])
        }
      })
    })


    const defaultOptions = {
        loop: true,
        autoplay: true,
        animationData: AnimationData,
        rendererSettings: {
          preserveAspectRatio: "xMidYMid slice",
        },
      };

     
      
      const sendMessage=async (e)=>{
        if(e.key==="Enter" && newMessage)
        {
            try {
                const config={
                    headers:{
                        "Content-Type":"application/json",
                        Authorization:`Bearer ${user.token}`
                    }
                }

                setNewMessage("")
                const {data}=await axios.post('http://localhost:4000/api/message',{
                    content:newMessage,
                    chatId:selectedChat._id
                },config)

                if(!data)
                {
                    console.log("Messages can't be sent");
                    throw new Error("Message can't be sent")
                }
                console.log(data)
                //send msg instantaneously
                socket.emit("new-msg",data)
                socket.emit("stop typing",selectedChat._id)
                setMessages([...messages,data])
            } catch (error) {
                toast({
                    title: "Error Occured!",
                    description: "Failed to send the Message",
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                    position: "bottom",
                  });
            }
        }

      }

      const typingHandler = (e) => {
        setNewMessage(e.target.value);
    
        if (!socketConnected) return;
    
        if (!typing) {
          setTyping(true);
          socket.emit("typing", selectedChat._id);
        }
        let lastTypingTime = new Date().getTime();
        var timerLength = 3000;
        setTimeout(() => {
          var timeNow = new Date().getTime();
          var timeDiff = timeNow - lastTypingTime;
          if (timeDiff >= timerLength && typing) {
            socket.emit("stop typing", selectedChat._id);
            setTyping(false);
          }
        }, timerLength);
      };


      useEffect(()=>{
         //fetching the chats 
      const fetchMessages=async (e)=>{
        if(!selectedChat)
        {
            return ;
        }

        try {
            setLoading(true)
            const config={
                headers:{
                    Authorization:`Bearer ${user.token}`,

                }
            }

            const {data}=await axios.get(`http://localhost:4000/api/message/${selectedChat._id}`,config)

            if(!data)
            {
                setLoading(false)
                console.log("Chats were not loaded");
            }

            // console.log("Fetched messages ",data)

            setMessages(data)
            setLoading(false)

            socket.emit("join-chat",selectedChat._id)
        } catch (error) {
              toast({
                    title: "Error Occured!",
                    description: "Failed to Load the Messages",
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                    position: "bottom",
                });
        }
      }
        fetchMessages()
        // backup of the selectedChat 
        selectedChatCompare=selectedChat
         
      },[toast,user?.token,selectedChat])


  return (
    <>
      {
        selectedChat?(
            <>
             <Text
             fontSize={{ base: "28px", md: "30px" }}
             pb={3}
             px={2}
             w="100%"
             fontFamily="Work sans"
             display="flex"
             justifyContent={{ base: "space-between" }}
             alignItems="center"
             >
                <IconButton
                display={{ base: "flex", md: "none" }}
                icon={<ArrowBackIcon />}
                onClick={() => setSelectedChat("")}
                />
                    {
                        !selectedChat.isGroupChat ?(
                                <>
                                {getSender(user,selectedChat.users)}
                                <ProfileModal
                                 user={getSenderFull(user,selectedChat.users)}
                                />

                                </>
                        ):(
                            <>
                            {
                                selectedChat.chatName.toUpperCase()
                                
                            }
                            <UpdateGroupModal
                            fetchAgain={fetchAgain}
                            setFetchAgain={setFetchAgain}
                            />
                            </>
                        )
                    }

               

             </Text>

             <Box
                display="flex"
                flexDirection="column"
                justifyContent="flex-end"
                p={3}
                bg="#E8E8E8"
                w="100%"
                h="100%"
                borderRadius="lg"
                overflowY="hidden"
            >
            {
                loading ?
                (
                    <Spinner
                    size="xl"
                    w={20}
                    h={20}
                    alignSelf="center"
                    margin="auto"
                    />
                    
                ):(
                    <div className="messages">
                    <MessagesComponent messages={messages} style={{display:"flex",flexDirection:"column",overflowY:"scroll",scrollbarWidth:"none"}}/>
                  </div>
                )
            }

            <FormControl
            onKeyDown={sendMessage}
            id="first-name"
            isRequired
            mt={3}
            >
                {
                    istyping ?(
                        <div>
                            <Lottie
                            options={defaultOptions}
                            width={70}
                            style={{marginBottom:15,marginLeft:0}}
                            />
                        </div>
                    ):(
                        <>
                        </>
                    )
                }
                <Input
                 variant="filled"
                 bg="#E0E0E0"
                 placeholder="Start tying your msg"
                 value={newMessage}
                 onChange={typingHandler}
                />

            </FormControl>
            </Box>
            </>
        ):(
            <Box display="flex" alignItems="center" justifyContent="center" h="100%">
            <Text fontSize="3xl" pb={3} fontFamily="Work sans">
              Click on a user to start chatting
            </Text>
          </Box>
        )
      }
    </>
  )
}

export default SingleChat
