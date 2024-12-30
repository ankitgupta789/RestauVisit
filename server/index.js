const express = require("express");
const app = express();

const userRoutes = require("./routes/User.js");
const profileRoutes = require("./routes/Prof.js");
//const paymentRoutes = require("./routes/Payments");
const courseRoutes = require("./routes/Course");
const feedbackRoutes=require("./routes/Feedback2.js")
const queryRoutes=require("./routes/Query.js")
const noteRoutes=require("./routes/Note.js")
const questionRoutes=require("./routes/Question.js")
const chatRouter = require('./routes/chatRoutes/chatRoutes.js');
const userRouter=require("./routes/UserRoutes/userData.js")
const messageRoutes = require('./routes/messageRoutes/messageRoutes.js');
const database = require("./config/database");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const {cloudinaryConnect } = require("./config/cloudinary");
const fileUpload = require("express-fileupload");
const dotenv = require("dotenv");
const commentRoutes=require("./routes/Comments.js");
const ratingRoutes=require("./routes/Rating.js");
const photosRoutes=require("./routes/Photos.js");
const menuRoutes=require("./routes/Menu.js");
const reviewRoutes=require("./routes/Review.js");
const cartRoutes=require("./routes/Cart.js");
const orderRoutes=require("./routes/Order.js");
dotenv.config();
const PORT = process.env.PORT || 4000;

//database connect
database.connect();
//middlewares
app.use(express.json());
app.use(cookieParser());
app.use(
	cors({
		origin:"http://localhost:3000",
		credentials:true,
	})
)

app.use(
	fileUpload({
		useTempFiles:true,
		tempFileDir:"/tmp",
	})
)
//cloudinary connection
cloudinaryConnect();

//routes
app.use("/api/v1/auth", userRoutes);
app.use("/api/v1/profile", profileRoutes);
app.use("/api/v1/course", courseRoutes);
app.use("/api/user",userRouter)
app.use("/api/v1/feedback", feedbackRoutes);
app.use("/api/community",chatRouter)
app.use("/api/message", messageRoutes)
app.use("/api/v1/query",queryRoutes);
app.use("/api/v1/note",noteRoutes);
app.use("/api/v1/question",questionRoutes);
app.use("/api/v1/comment",commentRoutes);
app.use('/api/v1/rating', ratingRoutes);
app.use('/api/v1/photos', photosRoutes);
app.use('/api/v1/menu', menuRoutes);
app.use('/api/v1/review', reviewRoutes);
app.use('/api/v1/cart',cartRoutes);
app.use('/api/v1/order',orderRoutes);
//def route

app.get("/", (req, res) => {
	return res.json({
		success:true,
		message:'Your server is up and running....'
	});
});

const server=app.listen(PORT, () => {
	console.log(`App is running at ${PORT}`)
})



const io = require('socket.io')(server, {
	pingTimeout: 50000,
	cors: {
	  origin: 'http://localhost:3000', // Specify your frontend URL
	  methods: ["GET", "POST"],
	  credentials: true
	}
  });
  
  io.on("connection", (socket) => {
	console.log("Connected to the client (socket.io)");
  
	socket.on("setup", (userData) => {
	  socket.join(userData._id);
	  console.log("This is the user id ", userData._id);
	  socket.emit("connected");
	});
  
	socket.on("join-chat", (room) => {
	  console.log("User joined the room ", room);
	});
  
	socket.on("new-msg", (newMsg) => {
	  var chat = newMsg.chat;
  
	  if (!chat.users) {
		return console.log("Chat users not defined");
	  }
  
	  chat.users.forEach((user) => {
		if (user._id === newMsg.sender._id) {
		  return;
		}
		socket.in(user._id).emit("Msg-recieved", newMsg);
	  });
	});
  
	socket.on("typing", (user) => socket.in(user).emit("Typing"));
	socket.on("stop typing", (room) => socket.in(room).emit("Stop typing"));
  
	socket.off("setup", (userData) => {
	  console.log("USER DISCONNECTED");
	  socket.leave(userData._id);
	});
  });
  