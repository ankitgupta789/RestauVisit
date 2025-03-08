import React from "react";
import ReactDOM from "react-dom/client";
import { Toaster } from "react-hot-toast";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import {Provider} from "react-redux";
import rootReducer from "./reducer";
import {configureStore} from "@reduxjs/toolkit"
import { ChakraProvider } from "@chakra-ui/react";
import ChatProvider from "./UserContext.js";
import 'react-app-polyfill/stable';
import { Buffer } from 'buffer';
import crypto from 'crypto-browserify';
// import { Buffer } from 'buffer';
import process from 'process';

// window.Buffer = Buffer;
window.process = process;
// Provide polyfills globally
window.Buffer = Buffer;

const store=configureStore({
  reducer:rootReducer,
});


const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    
  <ChakraProvider>
      <Provider store={store}>
        <BrowserRouter>
          <ChatProvider>
          
             <App />
             <Toaster/>
           </ChatProvider>
        </BrowserRouter>
  
      </Provider>
  </ChakraProvider>

);
