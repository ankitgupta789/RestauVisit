const express = require("express");
// const app = express();

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
// const ratingRoutes=require("./routes/Rating.js");
const photosRoutes=require("./routes/Photos.js");
const menuRoutes=require("./routes/Menu.js");
const reviewRoutes=require("./routes/Review.js");
const cartRoutes=require("./routes/Cart.js");
const orderRoutes=require("./routes/Order.js");
const paymentRoutes=require("./routes/Payment.js")
const RestauNotifications=require("./routes/RestauNotification.js")
const tableRoutes=require("./routes/Restaurant/Table.js");
const {app,server}=require('./middlewares/Socket.js')
const bookTableRoutes=require('./routes/Restaurant/BookTable.js')

const replyRoutes=require("./routes/ReplyReview.js")
const http = require('http');
// const Server = http.createServer(app);
dotenv.config();
const PORT = process.env.PORT || 4000;
const connectedSockets={};
//database connect
database.connect();
//middlewares
// app.use(express.json());
 app.use(cookieParser());
app.use(
	cors({
		origin:"http://localhost:3000",
		credentials:true,
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
// app.use('/api/v1/rating', ratingRoutes);
app.use('/api/v1/photos', photosRoutes);
app.use('/api/v1/menu', menuRoutes);
app.use('/api/v1/review', reviewRoutes);
app.use('/api/v1/cart',cartRoutes);
app.use('/api/v1/order',orderRoutes);
app.use('/api/v1/payment',paymentRoutes);
app.use('/api/v1/restauNotify',RestauNotifications);
app.use('/api/v1/table',tableRoutes);
app.use('/api/v1/book', bookTableRoutes);
app.use('/api/v1/reply',replyRoutes);
//def route
app.get("/", (req, res) => {
	return res.json({
		success:true,
		message:'Your server is up and running....'
	});
});

// const server=app.listen(PORT, () => {
// 	console.log(`App is running at ${PORT}`)
// })

server.listen(PORT,()=>{
	console.log('server lisning on https://localhost:3000')
})
