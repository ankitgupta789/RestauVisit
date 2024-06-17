const express = require("express")
const router = express.Router()

const {
    createQuestion,
    getQuestionsByDocumentName
} = require("../controllers/Question")



router.post("/createQuestion",createQuestion)
router.get("/getQuestionsByDocumentName",getQuestionsByDocumentName);

module.exports = router