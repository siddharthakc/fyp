const mongoose = require("mongoose");

const connectDb = async () => {
  try {
    // Ensure that the DB_URL environment variable is set
    if (!process.env.DB_URL) {
      throw new Error("DB_URL environment variable is not set.");
    }

    // Connect to the MongoDB database
    await mongoose.connect(process.env.DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // Check if the connection to the database was successful
    if (mongoose.connection.readyState !== 1) {
      throw new Error("Failed to establish a connection to the database.");
    }

    // Log a successful database connection
    console.log("Connected to the database.".magenta);
  } catch (error) {
    // Log any errors that occur during the connection process
    console.error(`Error: ${error.message}`.red);
    // Terminate the application with a failure status code
    process.exit(1);
  }
};

module.exports = connectDb;
