require("dotenv").config();

// to create server
const express = require("express");

// To connect database
const connectDB = require("./config/database");

// import cookies parser
const cookieParser = require("cookie-parser");
const cors = require("cors");

// to create application
const app = express();

/* ================= MIDDLEWARE ================= */
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

/* ================= ROUTES ================= */
const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const userRouter = require("./routes/user");

// Use routes
app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/request", requestRouter);
app.use("/", userRouter);

/* ================= DB + SERVER ================= */
const PORT = process.env.PORT || 3000;

connectDB()
  .then(() => {
    console.log("Database connection established");
    app.listen(PORT, () => {
      console.log(`Server is listening on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Database cannot be connected", err);
  });
