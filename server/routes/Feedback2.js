
const express = require("express")
const router = express.Router()
console.log("hello")
//import controllers
 const{
    createFeedback,
    getAllFeedback,
 }=require("../controllers/Feedback2cont")


router.post("/createfeedback",createFeedback)
router.get("/getAllFeedback",getAllFeedback)
 
module.exports = router