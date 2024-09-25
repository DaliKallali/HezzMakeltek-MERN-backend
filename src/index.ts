import express, { Request, Response } from "express";
import cors from "cors";
import "dotenv/config";
import mongoose from "mongoose";
import morgan from "morgan";
import UserRoute from "./routes/UserRoute";
const app = express();
app.use(express.json());
app.use(cors());
app.use(morgan("dev"));
mongoose
  .connect(process.env.MONGODB_CONNECTION_STRING as string)
  .then(() => console.log("connected to database"));

app.get("/health", async (req: Request, res: Response) => {
  res.send({ message: "health OK!" });
});

app.use("/api/my/user", UserRoute);

app.listen(7000, () => {
  console.log("Server started on localhost:7000");
});
