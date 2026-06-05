const mongoose = require("mongoose");

async function connectDatabase() {
  try {
    await mongoose.connect(
      `${process.env.MONGO_URI}${process.env.DATABASE_NAME}`,
    );
    console.log("server is connected to database successfully!!!");
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

module.exports = connectDatabase;
