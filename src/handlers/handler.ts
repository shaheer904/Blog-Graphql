import { GraphQLList, GraphQLObjectType, GraphQLSchema } from "graphql";
import { BlogType, CommentType, UserType } from "../schema/schema";
import User from "../models/Users.model";
import Blog from "../models/Blog.model";
import Comment from "../models/Comment.model";

const RootQuery = new GraphQLObjectType({
  name: "RootQuery",
  fields: {
    users: {
      type: GraphQLList(UserType),
      async resolve() {
        const users = await User.find();
        return users;
      },
    },
    blogs: {
      type: GraphQLList(BlogType),
      async resolve() {
        const blogs = await Blog.find();
        return blogs;
      },
    },
    comments: {
      type: GraphQLList(CommentType),
      async resolve() {
        const comments = await Comment.find();
        return comments;
      },
    },
  },
});

export default new GraphQLSchema({ query: RootQuery });
