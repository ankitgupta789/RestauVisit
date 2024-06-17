const express = require("express")
const router = express.Router()
const { auth } = require("../middlewares/auth")
const {
  createProfile,
  getProfileByEmail,
  updateProfile
} = require("../controllers/Prof")

// ********************************************************************************************************
//                                      Profile routes
// ********************************************************************************************************
// Delet User Account

router.post("/createProfile",createProfile)
router.get("/getProfileByEmail",getProfileByEmail)
router.put('/updateProfile/:email', updateProfile);
module.exports = router