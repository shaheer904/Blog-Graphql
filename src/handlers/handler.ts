import {
  GraphQLError,
  GraphQLID,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
} from "graphql";
import { BlogType, CommentType, UserType } from "../schema/schema";
import User from "../models/Users.model";
import Blog from "../models/Blog.model";
import Comment from "../models/Comment.model";
import { Document } from "mongoose";
import { compareSync, hashSync } from "bcryptjs";

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

const mutations = new GraphQLObjectType({
  name: "mutations",
  fields: {
    signup: {
      type: UserType,
      args: {
        name: { type: GraphQLNonNull(GraphQLString) },
        email: { type: GraphQLNonNull(GraphQLString) },
        password: { type: GraphQLNonNull(GraphQLString) },
      },
      async resolve(parent, { name, email, password }) {
        let existingUser = Document<any, any, any>;

        try {
          existingUser = await User.findOne({ email });

          if (existingUser) {
            throw new GraphQLError("User with email already exists.");
          }
          const hashPassword = await hashSync(password);
          const user = new User({ email, name, password: hashPassword });
          return await user.save();
        } catch (error) {
          console.log(error);
          throw new GraphQLError("Error", error);
        }
      },
    },

    login: {
      type: UserType,
      args: {
        email: { type: GraphQLNonNull(GraphQLString) },
        password: { type: GraphQLNonNull(GraphQLString) },
      },
      async resolve(parent, { email, password }) {
        let existingUser = Document<any, any, any>;
        existingUser = await User.findOne({ email });
        if (!existingUser) {
          throw new Error("No user found with this email");
        }
        const dcrypt = await compareSync(
          password,
          //@ts-ignore
          existingUser?.password
        );
        if (!dcrypt) {
          throw new Error("Invalid credentails");
        }
        return existingUser;
      },
    },

    addBlog: {
      type: BlogType,
      args: {
        title: { type: GraphQLNonNull(GraphQLString) },
        content: { type: GraphQLNonNull(GraphQLString) },
        user: { type: GraphQLNonNull(GraphQLID) },
      },

      async resolve(parent, { title, content, user }) {
        console.log(user);
        let blog: Document<any, any, any>;
        try {
          blog = new Blog({ title, content, user: user });
          return await blog.save();
        } catch (error) {
          console.log(error);
          throw new Error("Error", error);
        }
      },
    },

    updateBlog: {
      type: BlogType,
      args: {
        id: { type: GraphQLNonNull(GraphQLID) },
        title: { type: GraphQLString },
        content: { type: GraphQLString },
      },

      async resolve(parent, { id, title, content }) {
        let blog: Document<any, any, any>;
        try {
          blog = await Blog.findOne({ _id: id });
          if (!blog) {
            return new Error("Blog not found");
          }
          blog = await Blog.findByIdAndUpdate(
            { _id: id },
            { title: title, content: content },
            { new: true }
          );
          return blog;
        } catch (error) {
          console.log(error);
          throw new Error("Error", error);
        }
      },
    },
    deleteBlog: {
      type: BlogType,
      args: {
        id: { type: GraphQLNonNull(GraphQLID) },
      },

      async resolve(parent, { id }) {
        let blog: Document<any, any, any>;
        try {
          blog = await Blog.findOne({ _id: id });
          if (!blog) {
            return new Error("Blog not found");
          }
          blog = await Blog.findByIdAndDelete({ _id: id });
          return blog;
        } catch (error) {
          console.log(error);
          throw new Error("Error", error);
        }
      },
    },
  },
});

export default new GraphQLSchema({ query: RootQuery, mutation: mutations });
