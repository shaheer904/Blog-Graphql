import mongoose, { Schema } from "mongoose";

const BlogSchema: Schema = new Schema(
  {
    title: { type: String },
    content: { type: String },
    user: { type: mongoose.Types.ObjectId, ref: "User" },
    comments: [{ type: mongoose.Types.ObjectId, ref: "Comment" }],
  },
  { timestamps: true }
);

const Blog = mongoose.model("Blog", BlogSchema);

export default Blog;
