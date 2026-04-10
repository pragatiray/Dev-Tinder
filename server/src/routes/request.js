const express = require("express");
const { userAuth } = require("../middlewares/auth");
const requestRouter = express.Router();
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");

requestRouter.post(
    "/request/send/:status/:toUserId",
    userAuth,
    async (req, res) => {
        try {
            const fromUser = req.user._id;
            const { toUserId, status } = req.params;

            const allowedStatuses = ["ignored", "interested"];
            if (!allowedStatuses.includes(status)) {
                return res.status(400).json({
                    message:
                        "Invalid status. Allowed values are: " + allowedStatuses.join(", "),
                });
            }

            const toUser = await User.findById(toUserId);
            if (!toUser) {
                return res.status(404).json({ message: "Recipient user not found" });
            }

            const existingConnectionRequest = await ConnectionRequest.findOne({
                $or: [
                    { fromUserId: fromUser, toUserId },
                    { fromUserId: toUserId, toUserId: fromUser },
                ],
            });

            if (existingConnectionRequest) {
                return res.status(400).json({
                    message: "A connection request already exists between these users",
                });
            }

            const connectionRequest = new ConnectionRequest({
                fromUserId: fromUser,
                toUserId,
                status,
            });

            const data = await connectionRequest.save();

            res.json({
                message: `${req.user.firstName} is ${status} in ${toUser.firstName}`,
                data,
            });
        } catch (err) {
            console.error(err);
            res.status(500).send(err.message);
        }
    },
);

requestRouter.post(
    "/request/review/:status/:requestId",
    userAuth,
    async (req, res) => {
        try {
            const loggedInUser = req.user;
            const { status, requestId } = req.params;
            console.log("Reviewing connection request:", { status, requestId });
            const allowedStatuses = ["accepted", "rejected"];
            if (!allowedStatuses.includes(status)) {
                return res.status(400).json({
                    message:
                        "Invalid status. Allowed values are: " + allowedStatuses.join(", "),
                });
            }
            console.log(
                "Finding connection request with ID:",
                requestId,
                loggedInUser._id,
            );
            const connectionRequest = await ConnectionRequest.findOne({
                _id: requestId,
                toUserId: loggedInUser._id,
                status: "interested",
            });
            console.log("Found connection request:", connectionRequest);
            if (!connectionRequest) {
                return res
                    .status(404)
                    .json({ message: "Connection request not found" });
            }

            if (connectionRequest.toUserId.toString() !== req.user._id.toString()) {
                return res
                    .status(403)
                    .json({ message: "You are not authorized to review this request" });
            }

            connectionRequest.status = status;
            const updatedConnectionRequest = await connectionRequest.save();

            res.json({
                message: `Connection request ${status}`,
                data: updatedConnectionRequest,
            });
        } catch (err) {
            console.error(err);
            res.status(500).send(err.message);
        }
    },
);

module.exports = requestRouter;