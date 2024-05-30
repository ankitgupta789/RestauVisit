const express=require('express')

const router=express.Router()

// will make one route to fetch the msg and one for sending the messages
const authmiddleware=require('../../middlewares/checkAuth/authMiddleware.js');
const { sendMessage, getAllMessages } = require('../../controllers/Messages/messageController.js')

router.route('/').post(authmiddleware,sendMessage)
router.route('/:chatId').get(authmiddleware,getAllMessages)



module.exports=router