const Message=require('../../models/message/messageModal.js')
const User=require('../../models/User.js')
const Chat=require('../../models/Chat/chatModal.js')


const getAllMessages=async (req,res)=>{
 try {
    const message=await Message.find({
        chat:req.params.chatId
    })
    .populate("sender","username pic email")
    .populate("chat")

    // console.log(message)

    res.status(200).json(message)
 } catch (error) {
    res.status(400);
    throw new Error(error.message);
 }
}



const sendMessage=async (req,res)=>{
    // chat id to whom the chat will be sent
    //sender of the message
    // reciver of the message
    try {
        //sender will be fetched from req.user
        const {content,chatId}=req.body 
        // console.log("From the Sending msg controller ",req.body)
        if(!content||!chatId)
        {
            console.log("Invalid data passed into request");
            return res.sendStatus(400)
        }

        var newMessage={
            sender:req.user._id,
            content:content,
            chat:chatId
        }

       try {
         var message=await Message.create(newMessage);

         //populating the other fields of message
         //execPopulate bcaz it's an instance of mongoose class so it can't be direcly populated like others

         message=await message.populate("sender","username pic")
         message=await message.populate("chat")
         message=await User.populate(message,{
            path:"chat.users",
            select:"username pic email"
         })
         
        //updating the latest message
        // console.log("Message ",message)
        const result = await Chat.findByIdAndUpdate(chatId, {
            latestMessage: message 
        });
    if(result)
    {
        console.log("latest message updated",result)

    }
    else
    {
        console.log("Latest msg not created")
    }

    res.status(201).json(message);


        } catch (error) {
            res.status(400).json({
                message:"Error while sending the message"
            });
            console.log("Error while sending the messages")
            throw new Error(error.message);
       }
    } catch (error) {
        res.status(400).json({
            message:"Error while sending the message, also req.body doesn't have proper data info"
        });
        throw new Error(error.message);
    }
}


module.exports={getAllMessages,sendMessage}