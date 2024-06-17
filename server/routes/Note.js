
const express = require("express")
const router = express.Router()

//import controllers
 const{
    createNote,
    getAllNote,
    deleteNote
 }=require("../controllers/Note")


router.post("/createNote",createNote)
router.get("/getAllNote",getAllNote)
router.delete("/deleteNote/:noteId",deleteNote)

 
module.exports = router