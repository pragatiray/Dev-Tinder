const express = require("express");
const { userAuth } = require("../middlewares/auth");
const { validateProfileEditData } = require("../utils/validation");
const profileRouter = express.Router();
const crypto = require("crypto");
const bcrypt = require("bcrypt");
const User = require("../models/user");

profileRouter.get("/profile/view", userAuth, async (req, res) => {
    try {
        const user = req.user;
        res.send(user);
    } catch (err) {
        return res.status(400).send("Invalid token" + err.message);
    }
});

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
    try {
        if (!validateProfileEditData(req)) {
            throw new Error("Invalid profile edit data");
        }
        const loggedInUser = req.user;
        Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]));

        await loggedInUser.save();

        res.json({
            message: `${loggedInUser.firstName}, Your profile updated successfully!`,
            Data: loggedInUser,
        });
    } catch (err) {
        return res.status(400).send("ERROR:" + err.message);
    }
});

profileRouter.patch("/profile/password", userAuth, async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body;

        // Check fields exist
        if (!oldPassword || !newPassword) {
            return res.status(400).send("Both old and new password are required");
        }

        const loggedInUser = req.user;

        //  Verify old password
        const isPasswordValid = await bcrypt.compare(
            oldPassword,
            loggedInUser.password,
        );

        if (!isPasswordValid) {
            return res.status(400).send("Old password is incorrect");
        }

        //  Hash new password
        const newPasswordHash = await bcrypt.hash(newPassword, 10);

        //  Update password
        loggedInUser.password = newPasswordHash;
        await loggedInUser.save();

        res.send("Password updated successfully!");
    } catch (err) {
        res.status(500).send("ERROR: " + err.message);
    }
});

profileRouter.post("/forgot-password", async (req, res) => {
    try {
        const { emailId } = req.body;

        const user = await User.findOne({ emailId });
        if (!user) {
            return res.status(400).send("User not found");
        }

        // Generate reset token
        const resetToken = crypto.randomBytes(32).toString("hex");

        user.resetPasswordToken = resetToken;
        user.resetPasswordExpires = Date.now() + 10 * 60 * 1000; // 10 minutes

        await user.save();

        // Normally you send email here
        res.send(`Reset link: http://localhost:3000/reset-password/${resetToken}`);
    } catch (err) {
        res.status(400).send("ERROR: " + err.message);
    }
});

profileRouter.patch("/reset-password/:token", async (req, res) => {
    try {
        const { token } = req.params;
        const { newPassword } = req.body;

        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() },
        });

        if (!user) {
            return res.status(400).send("Invalid or expired token");
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        user.password = hashedPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;

        await user.save();

        res.send("Password reset successful!");
    } catch (err) {
        res.status(400).send("ERROR: " + err.message);
    }
});

module.exports = profileRouter;