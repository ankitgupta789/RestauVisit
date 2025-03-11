const express = require("express")
const router = express.Router()
const { auth } = require("../middlewares/auth")
const {
  createProfile,
  getProfileByEmail,
  updateProfile,
  searchRestaurants,
  searchRestaurantsCity,
  getProfileById 
} = require("../controllers/Prof")

// ********************************************************************************************************
//                                      Profile routes
// ********************************************************************************************************
// Delet User Account

router.post("/createProfile",createProfile)
router.get("/getProfileByEmail",getProfileByEmail)
router.put('/updateProfile/:email', updateProfile);
router.get("/searchRestaurants", searchRestaurants);
router.get("/searchRestaurantsCity", searchRestaurantsCity);
router.get("/getProfileById/:id",getProfileById)
module.exports = router