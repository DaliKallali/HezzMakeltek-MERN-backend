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
const menuItemSchema = new mongoose.Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    default: () => new mongoose.Types.ObjectId(),
  },
  name: { type: String, required: true },
  price: { type: Number, required: true },
});

const restaurantSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  restaurantName: { type: String, required: true },
  city: { type: String, required: true },
  country: { type: String, default: "Tunisia" },
  deliveryPrice: { type: Number, required: true },
  estimatedDeliveryTime: { type: Number, required: true },
  cuisines: [{ type: String, required: true }],
  menuItems: [menuItemSchema],
  imageUrl: { type: String, required: true },
  lastUpdated: { type: Date, required: true },
});

const Restaurant = mongoose.model("Restaurant", restaurantSchema);

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
    const users = await User.find().exec();

    // Read JSON file
    const restaurantsData = JSON.parse(
      fs.readFileSync("./restaurants_data.json", "utf-8")
    );
    const restaurantsWithUsers = restaurantsData.map((restaurant, index) => {
      return {
        ...restaurant,
        user: users[index % users.length]._id, // Use modulus to cycle through users
      };
    });
    // Insert data into the database
    await Restaurant.insertMany(restaurantsWithUsers);
    console.log("Data successfully inserted into MongoDB Atlas");

    // Close the connection
    mongoose.connection.close();
  } catch (error) {
    console.error("Error inserting data", error);
  }
}
