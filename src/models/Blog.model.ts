import mongoose, { Schema } from "mongoose";

const BlogSchema: Schema = new Schema(
  {
    title: { type: String },
    content: { type: String },
  },
  { timestamps: true }
);

const Blog = mongoose.model("Blog", BlogSchema);

export default Blog;
