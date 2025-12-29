const express = require("express");
const profileRouter = express.Router();
const userAuth = require("../middleware/auth");

// ================= PROFILE VIEW =================
profileRouter.get("/profile/view", userAuth, (req, res) => {
  res.json(req.user);
});

// 🔥 HANDLE PREFLIGHT REQUEST
profileRouter.options("/profile/edit", (req, res) => {
  res.sendStatus(200);
});

// ================= PROFILE EDIT =================
profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    const user = req.user;

    const allowedFields = [
      "firstName",
      "lastName",
      "photoUrl",
      "age",
      "gender",
      "about",
    ];

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        user[field] = req.body[field];
      }
    });

    await user.save();

    res.json({
      message: "Profile updated successfully",
      data: user,
    });
  } catch (err) {
    console.error("PROFILE EDIT ERROR:", err);
    res.status(500).json({ message: "Profile update failed" });
  }
});

module.exports = profileRouter;
