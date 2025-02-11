import mongoose from "mongoose";
import { Schema } from "mongoose";

const UserSchema:Schema = new Schema(
  {
    email: { type: String },
    name: { type: String },
    password: { type: String },
  },
  { timestamps: true }
);

const User = mongoose.model("User", UserSchema);

export default User;
