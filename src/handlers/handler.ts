import {
  GraphQLError,
  GraphQLID,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
} from "graphql";
import {
  blogListType,
  BlogType,
  CommentType,
  UserType,
} from "../schema/schema";
import User from "../models/Users.model";
import Blog from "../models/Blog.model";
import Comment from "../models/Comment.model";
import mongoose, { Document } from "mongoose";
import { compareSync, hashSync } from "bcryptjs";
import { generateToken } from "../utils/utils";
import { isAuthenticated } from "../middleware/middleware";
import { IBlogList } from "../utils/interface";

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
    getCurrentUser: {
      type: UserType,
      async resolve(parent, args, context, info) {
        await isAuthenticated(context);
        return context.user;
      },
    },

    blogs: {
      type: GraphQLList(BlogType),
      async resolve() {
        const blogs = await Blog.find();
        return blogs;
      },
    },
    getUserBlogs: {
      type: blogListType,
      async resolve(parent, { page = 1, limit = 10 }, context, info) {
        await isAuthenticated(context);

        const blogs: IBlogList[] = await Blog.aggregate([
          {
            $match: {
              user: new mongoose.Types.ObjectId(context.user._id),
            },
          },
          {
            $facet: {
              blogs: [{ $skip: (page - 1) * limit }, { $limit: limit }],
              totalCount: [{ $count: "count" }],
            },
          },
        ]);
        const data = {
          page: page,
          limit: limit,
          totalCount: blogs[0].totalCount[0].count
            ? blogs[0].totalCount[0].count
            : 0,
          blogs: blogs[0]?.blogs ? blogs[0]?.blogs : [],
        };
        return data;
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
        let existingUser: Document = await User.findOne({ email });
        if (!existingUser) {
          throw new Error("No user found with this email");
        }
        const dcrypt = await compareSync(
          password,
          //@ts-ignore
          existingUser?.password
        );
        if (!dcrypt) {
          throw new Error("Invalid credentials");
        }
        const token = await generateToken(existingUser);
        const data = existingUser.toObject();
        delete data.password;
        data.id = data._id;
        data.token = token;
        return data;
      },
    },

    addBlog: {
      type: BlogType,
      args: {
        title: { type: GraphQLNonNull(GraphQLString) },
        content: { type: GraphQLNonNull(GraphQLString) },
      },

      async resolve(parent, { title, content, user }, context) {
        await isAuthenticated(context);
        let blog: Document<any, any, any>;
        try {
          blog = new Blog({ title, content, user: context.user });
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
    addComment: {
      type: CommentType,
      args: {
        blogId: { type: GraphQLNonNull(GraphQLID) },
        comment: { type: GraphQLNonNull(GraphQLString) },
      },
      async resolve(parent, { blogId, comment }, context) {
        await isAuthenticated(context);
        const data = await Comment.create({
          blog: blogId,
          text: comment,
          user: context.user,
        });
      },
    },
  },
});

export default new GraphQLSchema({ query: RootQuery, mutation: mutations });
