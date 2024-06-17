
const express = require("express")
const router = express.Router()
console.log("hello")
//import controllers
 const{
    createQuery,
    getAllQuery,
    deleteQuery,
 }=require("../controllers/Query")


router.post("/createQuery",createQuery)
router.get("/getAllQuery",getAllQuery)
router.delete("/deleteQuery/:queryId",deleteQuery)
 
module.exports = router