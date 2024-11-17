import { createContext, useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from 'react-router-dom';

export const ChatContext = createContext();

const ChatProvider=({ children }) =>{

  // const [user,setUser]=useState()
  const [selectedChat,setSelectedChat]=useState()
   const [notification,setNotification]=useState([])
   const [chats,setChats]=useState([])

   const { user } = useSelector((state) => state.profile);
  // useEffect(() => {
  //   const userInfo = JSON.parse(localStorage.getItem("user"));
  //   setUser(userInfo);
  //    console.log("From context",userInfo)

  // }, []);
  
 console.log("user is ??",user)
  return (
    <ChatContext.Provider value={{user,selectedChat,setSelectedChat,notification,setNotification,chats,setChats}}>
      {children}
    </ChatContext.Provider>
  );
}

export const ChatState=()=>{
  return useContext(ChatContext)
}
export default ChatProvider
