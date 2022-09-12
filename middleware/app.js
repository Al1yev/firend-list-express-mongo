const express = require("express");
const app = express();

const userRouter = require("../router/userRouter");

app.use(express.json());

app.use("/api/v1/user", userRouter);

module.exports = app;
