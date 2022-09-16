const handlerController = require("./handlerController");
const User = require("../model/userModel");
const Friends = require("../model/friendsModel");
const catchErrorAsync = require("../utility/catchErrorAsync");
const AppError = require("../utility/appError");

class UserController {
  getAllUser(req, res, next) {
    handlerController.getAllData(req, res, next, User);
  }

  getOneUser(req, res, next) {
    handlerController.getOneData(req, res, next, User);
  }

  createUser = catchErrorAsync(async (req, res, next) => {
    handlerController.createData(req, res, next, User);
  });

  updateUser(req, res, next) {
    handlerController.updateData(req, res, next, User);
  }

  deleteUser(req, res, next) {
    handlerController.deleteData(req, res, next, User);
  }

  requestFriend = catchErrorAsync(async (req, res, next) => {
    console.log("Keldi");

    let friend = await User.findOne({ _id: req.params.id });
    if (!friend)
      return next(
        new AppError("User not found while requesting to friend", 404)
      );

    // friendning friendsiga yangi sorovni qoshib qoyish
    await User.findByIdAndUpdate(
      { _id: friend._id },
      {
        $push: {
          friends: {
            user_id: req.user._id,
            status: "wait",
            whom: "me",
          },
        },
      }
    );

    // Userni arrayiga yangi sorovni qo'shib qo'yish
    await User.findByIdAndUpdate(
      { _id: req.user._id },
      {
        $push: {
          friends: {
            user_id: friend._id,
            status: "wait",
            whom: "him",
          },
        },
      }
    );

    res.status(201).json({
      status: "Success",
      message: "Request is send",
    });
  });
}

module.exports = new UserController();
