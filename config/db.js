const mongoose = require("mongoose");
require("dotenv").config({ path: "../.env" });

mongoose
  .connect(process.env.DB_LINK.replace("<password>", process.env.DB_PASSWORD))
  .then(() => console.log("DB is connected"))
  .catch((err) => console.log(err));

module.exports = mongoose;
