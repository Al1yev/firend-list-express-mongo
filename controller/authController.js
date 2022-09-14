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
    const { email } = req.body;
    if (await User.findOne({ email }))
      return next(new AppError("Email is already registered"));

    const user = await User.create(req.body);
    if (!user) return next(new AppError(`${Model} is not created !`));

    const token = createToken(user.id);
    resFunc(res, 201, "Success", data, token);
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

  checkToken = (req, res, next) => {
    const token = req.headers.authorization;
    if (!token) return next(new AppError("Token not found"));
    if (
      !(
        token.startsWith("Bearer") &&
        jwt.verify(token.split(" ")[1], process.env.JWT_SECRET_KEY)
      )
    )
      return next(new AppError("Token is invalid!"));
    console.log("Token otdi");
    next();
  };

  emailSender = catchErrorAsync(async (req, res, next) => {
    const user = await User.findById(req.params.id);
    const message = await new Email(user).sending();
    console.log(message);
    next();
  });
}

module.exports = new AuthController();
