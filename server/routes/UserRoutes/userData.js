const express = require('express');
const router = express.Router();

const authmiddleware = require("../../middlewares/checkAuth/authMiddleware.js");
const userController=require('../../controllers/SearchUserController.js');

 


router.route("/").get(authmiddleware,userController)

module.exports = router;
