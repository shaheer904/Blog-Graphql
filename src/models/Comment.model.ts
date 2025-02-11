import mongoose, { Schema } from "mongoose";

const CommentSchema: Schema = new Schema(
  {
    text: { type: String },
  },
  { timestamps: true }
);

const Comment = mongoose.model("Comment", CommentSchema);

export default Comment;
