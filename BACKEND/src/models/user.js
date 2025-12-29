const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const path = require("path");

require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      trim: true,
    },
    lastName: {
      type: String,
      trim: true,
    },
    emailId: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    photoUrl: {
      type: String,
      default: "https://cdn-icons-png.flaticon.com/512/149/149071.png",
    },

    // ✅ ADDED FIELDS (FIXES ERR_FAILED)
    age: {
      type: Number,
      min: 13,
      max: 100,
    },
    gender: {
      type: String,
      enum: ["male", "female", "other"],
    },
    about: {
      type: String,
      maxlength: 500,
    },

    skills: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

/* ================= JWT METHOD ================= */
userSchema.methods.getJWT = function () {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined");
  }

  return jwt.sign({ _id: this._id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

/* ================= PASSWORD VALIDATION ================= */
userSchema.methods.validatePassword = async function (passwordInput) {
  return bcrypt.compare(passwordInput, this.password);
};

module.exports = mongoose.model("User", userSchema);
