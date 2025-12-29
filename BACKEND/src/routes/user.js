const express = require("express");
const { userAuth } = require("../middleware/auth");

const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");

const userRouter = express.Router();

const USER_SAFE_DATA =
  "firstName lastName emailId age gender about skills photoUrl";

/* ===============================
   GET RECEIVED REQUESTS
   GET /user/request/received
================================ */
userRouter.get("/request/received", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const requests = await ConnectionRequest.find({
      toUserId: loggedInUser._id,
      status: "interested",
    }).populate("fromUserId", USER_SAFE_DATA);

    res.json({
      message: "Requests fetched successfully",
      data: requests,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* ===============================
   ACCEPT / REJECT REQUEST
   PATCH /user/request/review/:status/:requestId
================================ */
userRouter.patch(
  "/request/review/:status/:requestId",
  userAuth,
  async (req, res) => {
    try {
      const { status, requestId } = req.params;
      const loggedInUserId = req.user._id;

      if (!["accepted", "rejected"].includes(status)) {
        return res.status(400).json({ message: "Invalid status" });
      }

      const request = await ConnectionRequest.findOne({
        _id: requestId,
        toUserId: loggedInUserId,
        status: "interested",
      });

      if (!request) {
        return res.status(404).json({ message: "Request not found" });
      }

      request.status = status;
      await request.save();

      res.json({ message: `Request ${status} successfully` });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
);

/* ===============================
   FEED
   GET /user/feed
================================ */
userRouter.get("/feed", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    limit = limit > 50 ? 50 : limit;

    const skip = (page - 1) * limit;

    const requests = await ConnectionRequest.find({
      $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
    }).select("fromUserId toUserId");

    const hideUsers = new Set();
    requests.forEach((r) => {
      hideUsers.add(r.fromUserId.toString());
      hideUsers.add(r.toUserId.toString());
    });

    const users = await User.find({
      _id: { $nin: [...hideUsers, loggedInUser._id] },
    })
      .select(USER_SAFE_DATA)
      .skip(skip)
      .limit(limit);

    res.json({ data: users });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* ===============================
   CONNECTIONS
   GET /user/connections
================================ */
userRouter.get("/connections", userAuth, async (req, res) => {
  try {
    const loggedInUserId = req.user._id;

    const connections = await ConnectionRequest.find({
      status: "accepted",
      $or: [{ fromUserId: loggedInUserId }, { toUserId: loggedInUserId }],
    })
      .populate("fromUserId", USER_SAFE_DATA)
      .populate("toUserId", USER_SAFE_DATA);

    const connectedUsers = connections.map((conn) => {
      if (conn.fromUserId._id.toString() === loggedInUserId.toString()) {
        return conn.toUserId;
      }
      return conn.fromUserId;
    });

    res.json(connectedUsers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = userRouter;
