import mongoose, { Schema } from "mongoose";

const CommentSchema: Schema = new Schema(
  {
    text: { type: String },
    user: { type: mongoose.Types.ObjectId, ref: "User" },
    blog: { type: mongoose.Types.ObjectId, ref: "Blog" },
  },
  { timestamps: true }
);

const Comment = mongoose.model("Comment", CommentSchema);

export default Comment;
