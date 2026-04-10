const jwt = require("jsonwebtoken");
const User = require("../models/user");

const userAuth = async (req, res, next) => {
    const cookies = req.cookies;
    const { token } = cookies;

    try {
        if (!token) {
            throw new Error("Token is missing");
        }
        const decodedObj = await jwt.verify(token, "DEV@Tinder$790");
        const { _id } = decodedObj;

        const user = await User.findById(_id);
        if (!user) {
            throw new Error("User not found");
        }
        req.user = user;
        next();
    } catch (err) {
        return res.status(400).send("Invalid token: " + err.message);
    }
};

module.exports = {
    userAuth,
};