// Import needed modules to run the application
import mongoose from "mongoose";
import dotenv from "dotenv";

// Import express app
import app from "./app";

// Configure dotenv to load variables from .env file
dotenv.config();

// Asign .env file variables to const variables
const PORT = process.env.PORT;
const MONGO_URL: string = process.env.MONGO_URL ?? "";

mongoose
  .connect(MONGO_URL, {
    useNewUrlParser: true,
  } as mongoose.ConnectOptions)
  .then(() => {
    console.log("Connected to MongoDB");

    app.listen(PORT, () => {
      console.log(`App listening on port ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
