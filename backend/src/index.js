import "dotenv/config";
import mongoose from "mongoose";
import express from "express";
import cookieParser from "cookie-parser";
import { errorHandler } from "./utils/ErrorHandler.js";
import axios from "axios";
axios.defaults.withCredentials = true;
export default axios;

import cors from "cors";

import rideReqRouter from "./routes/RideReqRoute.js";
import userRouter from "./routes/UserRoute.js";
import groupRouter from "./routes/GroupRoute.js";

const FRONTEND_URL = process.env.FRONTEND_HOME_URL || "http://localhost:3000";

const app = express();
app.use(cookieParser());
app.use(
  cors({
    origin: FRONTEND_URL,
    credentials: true,
    methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(userRouter);
app.use(rideReqRouter);
app.use(groupRouter);
app.get("/test-env", (req, res) => {
  res.json({
    client_id: process.env.CLIENT_ID,
    redirect_uri: process.env.GOOGLE_OAUTH_REDIRECT_URL,
  });
});

app.use(errorHandler);
const port = process.env.PORT || 8080;
const dbURL = process.env.MONGO_URL;

async function main() {
  try {
    await mongoose.connect(dbURL);
    console.log("MongoDB connected ");
    app.listen(port, () => {
      console.log(
        `****************APP is Listening on port ${port}******************`
      );
    });
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error);
  }
}

main();
