const mongoose = require("mongoose");
const fs = require("fs");
const userSchema = new mongoose.Schema({
  auth0Id: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  name: {
    type: String,
  },
  addressLine1: {
    type: String,
  },
  city: {
    type: String,
  },
  country: {
    type: String,
  },
});

const User = mongoose.model("User", userSchema);

// MongoDB Atlas connection string
mongoose
  .connect(
    "mongodb+srv://nhezz:aZqwHYxThh9YcSZv@cluster0.9jrx6.mongodb.net/HEZZ?retryWrites=true&w=majority&appName=Cluster0"
  )
  .then(() => {
    console.log("connected to database");
    populateDatabase();
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB", error);
  });

// Function to populate the database with JSON data
async function populateDatabase() {
  try {
    // Read JSON file
    const data = JSON.parse(fs.readFileSync("./users_data.json", "utf-8"));

    // Insert data into the database
    await User.insertMany(data);
    console.log("Data successfully inserted into MongoDB Atlas");

    // Close the connection
    mongoose.connection.close();
  } catch (error) {
    console.error("Error inserting data", error);
  }
}
