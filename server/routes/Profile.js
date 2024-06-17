const express = require("express")
const router = express.Router()
const { auth } = require("../middlewares/auth")
const {
  createProfile,
  getProfileByEmail
} = require("../controllers/Profile")

// ********************************************************************************************************
//                                      Profile routes
// ********************************************************************************************************
// Delet User Account

router.post("/createProfile",createProfile)
router.get("/getProfileByEmail",getProfileByEmail)
module.exports = router