const app = require("./middleware/app");
require("dotenv").config({ path: "./.env" });

// Connecting to DB
require("./config/db");

// Listening to server
app.listen(process.env.PORT, process.env.URL, () =>
  console.log("Server is listening")
);
