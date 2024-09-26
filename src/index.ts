import express, { Request, Response } from "express";
import cors from "cors";
import "dotenv/config";
import mongoose from "mongoose";
import { v2 as cloudinary } from "cloudinary";
import morgan from "morgan";
import MyUserRoute from "./routes/MyUserRoute";
import MyRestaurantRoute from "./routes/MyRestaurantRoute";
const app = express();
app.use(express.json());
app.use(cors());
app.use(morgan("dev"));
mongoose
  .connect(process.env.MONGODB_CONNECTION_STRING as string)
  .then(() => console.log("connected to database"));

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

app.get("/health", async (req: Request, res: Response) => {
  res.send({ message: "health OK!" });
});

app.use("/api/my/user", MyUserRoute);
app.use("/api/my/restaurant", MyRestaurantRoute);
app.listen(7000, () => {
  console.log("Server started on localhost:7000");
});
