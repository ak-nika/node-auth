const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
const authRouter = require("./routers/authRouter");
const postsRouter = require("./routers/postsRouter");

const app = express();

app.use(cors());
app.use(helmet());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.json({ message: "Hello from the server!" });
});

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/posts", postsRouter);

module.exports = app;
