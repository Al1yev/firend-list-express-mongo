const mongoose = require("mongoose");
const validator = require("email-validator");
const bcrypt = require("bcryptjs");

const userSchema = mongoose.Schema({
  firstName: {
    type: String,
    required: [true, "Please enter firstName!"],
  },
  lastName: {
    type: String,
    required: [true, "Please enter lastName!"],
  },
  nickName: {
    type: String,
    required: [true, "Please enter nickName!"],
    unique: [true, "Nick is already registered"],
  },
  age: {
    type: Number,
    required: [true, "Please enter age!"],
  },
  aboutMe: {
    type: String,
  },

  // friends: [{}],

  email: {
    type: String,
    required: [true, "Please enter email!"],
    validate: [
      () => validator.validate(this.email),
      "Please enter a correct email!",
    ],
    unique: [true, "Email is already registered"],
  },
  password: {
    type: String,
    required: [true, "Please enter password!"],
    minLength: [8, "Password min length 8!"],
    maxLength: [16, "Password max length 16!"],
  },
  passwordConfirm: {
    type: String,
    required: [true, "Please enter passwordConfirm!"],
    validate: [
      () => this.password === this.passwordConfirm,
      "Different password and password confirm",
    ],
  },
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  next();
});

module.exports = mongoose.model("user", userSchema);
