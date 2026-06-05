require("dotenv").config();

const app = require("./src/app");
const connectToDatabase = require("./src/config/db");

app.listen(3000, () => {
  console.log("server is running port 3000");
});

connectToDatabase();
