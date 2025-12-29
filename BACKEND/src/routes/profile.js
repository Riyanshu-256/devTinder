const express = require("express");
const { userAuth } = require("../middleware/auth");

const profileRouter = express.Router();

/* ===============================
   VIEW PROFILE
   GET /profile/view
================================ */
profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    res.json(req.user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = profileRouter;
