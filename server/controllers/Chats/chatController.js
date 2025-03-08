const Chat=require('../../models/Chat/chatModal.js')
const User=require('../../models/User.js')

const accessChats=async (req,res)=>{
    try {
        //inparams
        const {userId}=req.body

        if(!userId){
            console.log("UserID not in the params ")
            return res.status(400)
        }

        var isChat =await Chat.find(
            {
                isGroupChat:false,
                $and:[
                    {users:{$elemMatch:{$eq:req.user._id}}},
                    {users:{$elemMatch:{$eq:userId}}}
                ]
            }
        )
        .populate("users","-password")
        .populate("latestMessage")

        isChat=await User.populate(isChat,{
            path:"latestMessage.sender",
            select:"username pic email"
        })
 
        if (isChat.length > 0) {
            res.send(isChat[0]);
            // console.log("Here is Chat ",isChat[0]);
          } else {
            var chatData = {
              chatName: "sender",
              isGroupChat: false,
              users: [req.user._id, userId],
            };
            // console.log(chatData);
        
            try {
              const createdChat = await Chat.create(chatData);
              const FullChat = await Chat.findOne({ _id: createdChat._id }).populate(
                "users",
                "-password"
              );
            //   console.log("Chat Created",FullChat);
              res.status(200).json(FullChat);
            } catch (error) {
              res.status(400);
              throw new Error(error.message);
            }
    }
 }
 catch (error) 
 {
     console.log(error);   
     throw new Error("Error in the chatController")
 }
}

//fetching chats
const fetchingChats=async (req,res)=>{
    try {
        Chat.find({users:{$elemMatch:{$eq:req.user._id}}})
        .populate("users","-password")
        .populate("groupAdmin","-password")
        .populate("latestMessage")
        .sort({updatedAt:-1})
        .then(async (results)=>{
            results=await User.populate(results,
                {
                    path:"latestMessage.sender",
                    select:"firstName pic email" 
                });
                // console.log(results);
            return res.status(201).send(results);
        })
    } catch (error) {
        console.log(error.message);
        res.status(400)
        // throw new Error("Error in fetching the chats")
    }
}

//creating group
const createGroup=async (req,res)=>{
    try {
        //taking users from body and then name of the group
        if(!req.body.name||!req.body.users)
        {
            res.send("Fill the required details first before making a group")
        }

        //obj passed from frontend in stringify format so we have to parse it 
        var users=JSON.parse(req.body.users);

        if(users.length<2)
        {
            return res.status(400).send("Enter more than 2 people ")            
        }
        //adding the curr user 
        users.push(req.user)
        try {
            const groupChat=await Chat.create({
                chatName:req.body.name,
                users:users,
                isGroupChat:true,
                groupAdmin:req.user 
            });
            if(!groupChat)
                {
                    res.status(404).json({message:"Not able to form a group Chat try again"})
                }
                console.log("ID",groupChat._id)
            const fullGrpChat=await Chat.findOne({_id:groupChat.id})
            .populate("users","-password")
            .populate("groupAdmin","-password")
            if(!fullGrpChat)
                {
                    res.status(404).json({message:"Not able to populate the fields for a grp chat"})
                }
            res.status(200).json(fullGrpChat)


        } catch (error) {
            console.log("Cannot form the group chat ",error.message);
        }
        
    } catch (error) {
        console.log("Error in group creation ",error.message);
    }
}



//rename a group
const renameGroup=async (req,res)=>{
    try {
        //get the chatid and chat name
        const {chatId,chatName}=req.body 
         //move the updated chat to db 
        const updatedGrp=await Chat.findByIdAndUpdate(
            chatId,
            {
                chatName:chatName
            },
            {
                new:true
            }
        )
        .populate("users","-password")
        .populate("groupAdmin","-password")

        if(!updatedGrp)
        {
            res.status(404).send("Not found")
            throw new Error("Error updating the grp")
        }

        res.status(200).json(updatedGrp)

    } catch (error) {
        console.log("Error in the grp creation",error);
    }
}

//remove from group ( only by a admin)

const removeFromGroup=async (req,res)=>{
    try {
        //search the group chat 
        //delete user from it 
        //return the deleted user from group chat
        //userId to be removed

        const {chatId,userId}=req.body 
        const removed=await Chat.findByIdAndUpdate(
                chatId,
                {
                    $pull:{users:userId}
                },
                {
                    new:true
                }
        )
        .populate("users","-password")
        .populate("groupAdmin","-password")

        if(!removed)
        {
            console.log("Chat not found")
            res.status(400).send("Chat not found")
            throw new Error("The user selected can't be removed due to some error")
        }

       res.status(201).json(removed)

    } catch (error) {
       console.log("Error removing the user ",error.message)
        throw new Error("Error removing the user ")
    }
}


//add someone to the group

const addToTheGroup=async (req,res)=>{
    try {
        //get the userId, chatId where it is to be added
        //push the userId to the users array of the chat
        //save this change to db

        const {userId,chatId}=req.body 
        // console.log(req.body);
        const addedChat=await Chat.findByIdAndUpdate(
            chatId,
            {
                $push:{
                    users:userId
                },
            },
            {
               new:true
            }
        )
        .populate("users","-password")
        .populate("groupAdmin","-password")
        // console.log(addedChat);

        if(!addedChat)
        {
            res.status(400).send("User can't be added due to some error")
            throw new Error("Chat Not found")
        }
        else
        {
            
                 return   res.status(200).json(addedChat)
        }
    } catch (error) {
        console.log(error.message)
        throw new Error("Error while adding the user to the group")
    }
}

module.exports={accessChats,fetchingChats,createGroup,renameGroup,removeFromGroup,addToTheGroup}