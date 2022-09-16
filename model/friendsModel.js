const mongoose = require("mongoose");

const friendSchema = mongoose.Schema({
  friendsIds: [
    {
      friendId: {
        type: mongoose.Schema.ObjectId,
        ref: "user",
      },
      status: {
        type: String,
        enum: ["wait", "added"],
        default: "wait",
      },
      whom: {
        type: String,
        enum: ["him", "me"],
        default: "him",
      },
    },
  ],
});

const Friends = mongoose.model("friends", friendSchema);

module.exports = Friends;
