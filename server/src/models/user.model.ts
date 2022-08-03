import { Schema, model } from "mongoose";

export default model(
  "User",
  new Schema({
    username: String,
    password: String,
    createdAt: { type: Date, default: Date.now },
  })
);
