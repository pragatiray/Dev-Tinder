require("dotenv").config();
const express = require("express");
const {connectDB} = require("./config/database");
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");

app.use(cors({
    // This MUST match your frontend URL exactly (no trailing slash)
    origin: "http://localhost:5173", 
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());
app.use(cookieParser());

const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const userRouter = require("./routes/user");

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);

connectDB()
  .then(() => {
    console.log("database connection established");
    app.listen(7777, () => {
      console.log("Server is successfully lisrenning on port 3000....");
    });
  })
  .catch((err) => {
    console.error("Database cannot be connected", err);
  });