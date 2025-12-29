require("dotenv").config();

const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const connectDB = require("./config/database");

const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const userRouter = require("./routes/user");

const app = express();

/* ================= CORS (BEST PRACTICE) ================= */
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

/* ================= MIDDLEWARE ================= */
app.use(express.json());
app.use(cookieParser());

/* ================= ROUTES ================= */
app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/request", requestRouter);
app.use("/user", userRouter);

/* ================= SERVER ================= */
const PORT = process.env.PORT || 3000;

connectDB()
  .then(() => {
    console.log(" Database connected");
    app.listen(PORT, () => {
      console.log(` Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error(" DB connection failed:", err.message);
  });
