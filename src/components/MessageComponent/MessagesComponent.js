import React from 'react'
import ScrollableFeed from 'react-scrollable-feed'
import { isLastMessage, isSameSender, isSameSenderMargin, isSameUser } from '../HelperFunc/logicFunc.js'
import { ChatState } from '../../UserContext.js'
import { Avatar, Tooltip } from '@chakra-ui/react'

const MessagesComponent = ({messages}) => {
    const {user}=ChatState()
  return (
    <ScrollableFeed>
        {messages && messages.map((m,idx)=>(
            <div key={m?._id} style={{display:"flex"}}>
                  {
                              console.log(m.sender)
                   }
                {
                    (isSameSender(messages,m,idx,user?._id)
                    ||
                    isLastMessage(messages,idx,user?._id)
                    )
                    &&
                    (
                        <Tooltip
                        label={m.sender?.firstName} placement="bottom-start" hasArrow
                        >
                            <Avatar
                            mt="7px"
                            mr={1}
                            size="sm"
                            cursor="pointer"
                            name={m.sender?.firstName}
                            src={m.sender?.pic}
                            />
                           
                        </Tooltip>
                    )

                }
                <span
                style={{
                    backgroundColor: `${
                      m.sender?._id === user?._id ? "#BEE3F8" : "#B9F5D0"
                    }`,
                    marginLeft: isSameSenderMargin(messages, m, idx, user?._id),
                    marginTop: isSameUser(messages, m, idx, user._id) ? 3 : 10,
                    borderRadius: "20px",
                    padding: "5px 15px",
                    maxWidth: "75%",
                  }}
                >
                    {m.content}
                </span>
            </div>
        ))}
      
    </ScrollableFeed>
  )
}

export default MessagesComponent
