const mongoose = require("mongoose");

const connectionRequestSchema = new mongoose.Schema(
    {
        fromUserId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "User",
        },
        toUserId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "User",
        },
        status: {
            type: String,
            enum: {
                values: ["ignored", "interested", "accepted", "rejected"],
                message: "{VALUES} is not a valid status",
            },
        },
    },
    { timestamps: true },
);

connectionRequestSchema.index({ fromUserId: 1, toUserId: 1 }, { unique: true });

connectionRequestSchema.pre("save", function () {
    if (this.fromUserId.equals(this.toUserId)) {
        throw new Error("fromUserId and toUserId cannot be the same");
    }
});

module.exports = mongoose.model("ConnectionRequest", connectionRequestSchema);