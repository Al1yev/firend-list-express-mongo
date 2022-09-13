const User = require("../model/userModel");
const AppError = require("../utility/appError");
const catchErrorAsync = require("../utility/catchErrorAsyncModel");
const handlerController = require("./handlerController");
const bcrypt = require("bcryptjs");
const resFunc = require("../utility/resFunc");

class AuthController {
  signUp = async (req, res, next) => {
    try {
      const { email } = req.body;

      if (await User.findOne({ email }))
        return next(new AppError("Email is already registered"));

      return handlerController.createData(req, res, next, User);
    } catch (err) {
      return next(new AppError(err));
    }
  };

  signIn = async (req, res, next) => {
    try {
      const { email, password } = req.body;

      const user = await User.findOne({ email });

      if (!user) return next(new AppError("User is not found"));

      if (!bcrypt.compare(password, user.password))
        return next(new AppError("Wrong password!"));

      resFunc(res, 200, "Success", user);
    } catch (err) {
      return next(new AppError(err));
    }
  };
}

module.exports = new AuthController();
