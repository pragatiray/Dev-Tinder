const express = require("express");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");
const userRouter = express.Router();
//get all pending connection requests for the logged in user
userRouter.get("/user/requests/received", userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;
        const pendingRequests = await ConnectionRequest.find({
            toUserId: loggedInUser,
            status: "interested",
        }).populate(
            "fromUserId",
            "firstName lastName photoUrl age gender skills about",
        );
        res.json({
            message: "Data fetched successfully",
            data: pendingRequests,
        });
    } catch (err) {
        res.status(400).send("Error: " + err.message);
    }
});

userRouter.get("/user/connections", userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;
        const connections = await ConnectionRequest.find({
            $or: [
                { fromUserId: loggedInUser._id, status: "accepted" },
                { toUserId: loggedInUser._id, status: "accepted" },
            ],
        })
            .populate(
                "fromUserId",
                "firstName lastName photoUrl age gender skills about",
            )
            .populate(
                "toUserId",
                "firstName lastName photoUrl age gender skills about",
            );

        const data = connections.map((conn) => {
            const otherUser =
                conn.fromUserId._id.toString() === loggedInUser._id.toString()
                    ? conn.toUserId
                    : conn.fromUserId;
            return {
                connectionId: conn._id,
                user: otherUser,
            };
        });

        res.json({
            message: "Connections fetched successfully",
            data,
        });
    } catch (err) {
        res.status(400).send("Error: " + err.message);
    }
});

//gets the profiles of all the other users on platform
userRouter.get("/feed", userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;

        // Pagination parameters
        const page = parseInt(req.query.page) || 1;
        let limit = parseInt(req.query.limit) || 10;
        limit = limit > 50 ? 50 : limit; // Max limit of 50
        const skip = (page - 1) * limit;

        // Get ALL connection/request records involving logged-in user
        const connectionRequests = await ConnectionRequest.find({
            $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
        });

        console.log("Total requests found:", connectionRequests.length);

        // Collect all related user IDs to exclude
        const hiddenUserIds = new Set();

        connectionRequests.forEach((req) => {
            if (req.fromUserId.toString() === loggedInUser._id.toString()) {
                hiddenUserIds.add(req.toUserId.toString());
            } else {
                hiddenUserIds.add(req.fromUserId.toString());
            }
        });

        // Also exclude self
        hiddenUserIds.add(loggedInUser._id.toString());

        // Fetch paginated feed users
        const users = await User.find({
            _id: { $nin: [...hiddenUserIds] },
        })
            .select("firstName lastName photoUrl age gender skills about")
            .skip(skip)
            .limit(limit);

        res.json({
            message: "Feed fetched successfully",
            page,
            limit,
            results: users.length,
            data: users,
        });
    } catch (err) {
        res.status(400).json({ error: "Error: " + err.message });
    }
});

module.exports = userRouter;