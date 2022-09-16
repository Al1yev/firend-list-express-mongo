const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config({ path: "../.env" });

const User = require("../model/userModel");
const AppError = require("../utility/appError");
const catchErrorAsync = require("../utility/catchErrorAsync");
const handlerController = require("./handlerController");
const resFunc = require("../utility/resFunc");
const Email = require("../utility/mail");

const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRES_IN,
    // algorithm: "RS256",
  });
};

class AuthController {
  signUp = catchErrorAsync(async (req, res, next) => {
    const user = await User.create(req.body);
    if (!user) return next(new AppError(`User is not created !`));

    const token = createToken(user.id);
    resFunc(res, 201, "Success", user, token);
  });

  signIn = catchErrorAsync(async (req, res, next) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) return next(new AppError("User is not found"));
    if (!bcrypt.compare(password, user.password))
      return next(new AppError("Wrong password!"));

    const token = createToken(user.id);
    resFunc(res, 200, "Success", user, token);
  });

  // Checking JWT token
  checkToken = catchErrorAsync(async (req, res, next) => {
    let token = req.headers.authorization;

    if (!token || !token.startsWith("Bearer"))
      return next(new AppError("Token not found"));
    token = token.split(" ")[1];
    if (!jwt.verify(token, process.env.JWT_SECRET_KEY))
      return next(new AppError("Token is invalid!"));

    const id = jwt.decode(token).id;
    const user = await User.findById(id);
    if (!user) return next(new AppError("User not found"));
    req.user = user;
    next();
  });

  // Sending email for test
  emailSender = catchErrorAsync(async (req, res, next) => {
    const user = await User.findById(req.params.id);
    const message = await new Email(user).sending();
    console.log(message);
    next();
  });
}

module.exports = new AuthController();
