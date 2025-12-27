// to create server
const express = require("express");
// To connect database
const connectDB = require("./config/database");
// import cookies parser
const cookieParser = require("cookie-parser");
const cors = require("cors");

// to create application
const app = express();

// Middleware
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

// Converts incoming JSON data into req.body
app.use(express.json());
// Allows server to read cookies from client (req.cookies)
app.use(cookieParser());

// MANAGE ALL ROUTES
const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const userRouter = require("./routes/user");

// Use routes
app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/request", requestRouter);
app.use("/", userRouter);

// CONNECT DB + START SERVER
connectDB()
  .then(() => {
    console.log("Database connection established...");
    app.listen(3000, () => {
      console.log("Server is listening on port 3000...");
    });
  })
  .catch(() => {
    console.error("Database cannot be connected");
  });
