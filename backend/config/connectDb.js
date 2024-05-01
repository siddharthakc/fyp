const mongoose = require("mongoose");

const connectDb = async () => {
  try {
    // check if DB_URL environment variable is set
    if (!process.env.DB_URL) {
      throw new Error("DB_URL environment variable is not set.");
    }

    // connect to MongoDB
    await mongoose.connect(process.env.DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // check if connection is successful
    if (mongoose.connection.readyState !== 1) {
      throw new Error("failed to establish a connection to the database.");
    }

    // log successful connection
    console.log("connected to the database.".magenta);
  } catch (error) {
    // log and exit on error
    console.error(`error: ${error.message}`.red);
    process.exit(1);
  }
};

module.exports = connectDb;
