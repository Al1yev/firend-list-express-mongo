const handlerController = require("./handlerController");
const User = require("../model/userModel");
const catchErrorAsync = require("../utility/catchErrorAsync");
const AppError = require("../utility/appError");

class UserController {
  getAllUser(req, res, next) {
    handlerController.getAllData(req, res, next, User);
  }

  getOneUser(req, res, next) {
    handlerController.getOneData(req, res, next, User);
  }

  createUser(req, res, next) {
    handlerController.createData(req, res, next, User);
  }

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
    let fArr = friend.friends;
    fArr.push({
      user_id: req.user._id,
      status: "wait",
      whom: "me",
    });
    await User.findByIdAndUpdate({ _id: friend._id }, { friends: fArr });

    // Userni arrayiga yangi sorovni qo'shib qo'yish
    let myArr = req.user.friends;
    myArr.push({
      user_id: friend._id,
      status: "wait",
      whom: "him",
    });
    await User.findByIdAndUpdate({ _id: req.user._id }, { friends: myArr });

    res.status(201).json({
      status: "Success",
      message: "Request is send",
    });
  });
}

module.exports = new UserController();
