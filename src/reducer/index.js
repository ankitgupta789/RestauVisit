import { combineReducers } from "@reduxjs/toolkit";
 
import authReducer from "../slices/authSlice";
import profileReducer from "../slices/profileSlice";
import cartReducer from "../slices/cartSlice";
 import documentReducer from "../slices/documentSlice"
const rootReducer=combineReducers({
  auth:authReducer,
  profile:profileReducer,
  cart:cartReducer,
  document:documentReducer,
})
export default rootReducer