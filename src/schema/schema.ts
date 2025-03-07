import {
  GraphQLID,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
} from "graphql";
import User from "../models/Users.model";

export const UserType = new GraphQLObjectType({
  name: "UserType",
  fields: {
    id: { type: GraphQLNonNull(GraphQLID) },
    email: { type: GraphQLNonNull(GraphQLString) },
    name: { type: GraphQLNonNull(GraphQLString) },
    password: { type: GraphQLString },
    token: { type: GraphQLString },
    createdAt: { type: GraphQLString },
    updatedAt: { type: GraphQLString },
  },
});
export const UserType1 = new GraphQLObjectType({
  name: "UserType1",
  fields: {
    _id: { type: GraphQLNonNull(GraphQLID) },
    email: { type: GraphQLNonNull(GraphQLString) },
    name: { type: GraphQLNonNull(GraphQLString) },
    createdAt: { type: GraphQLString },
    updatedAt: { type: GraphQLString },
  },
});
export const CommentType = new GraphQLObjectType({
  name: "CommentType",
  fields: {
    id: { type: GraphQLNonNull(GraphQLID) },
    text: { type: GraphQLNonNull(GraphQLString) },
    user: {
      type: UserType,
      async resolve(parent) {
        return await User.findOne({ _id: parent.user });
      },
    },
    createdAt: { type: GraphQLString },
    updatedAt: { type: GraphQLString },
  },
});

export const BlogType = new GraphQLObjectType({
  name: "BlogType",
  fields: {
    _id: { type: GraphQLNonNull(GraphQLID) },
    title: { type: GraphQLNonNull(GraphQLString) },
    content: { type: GraphQLNonNull(GraphQLString) },
    user: {
      type: UserType1,
      async resolve(parent) {
        return await User.findOne({ _id: parent.user }).select("-password");
      },
    },
    comments: {
      type: GraphQLList(CommentType),
      async resolve(parent) {
        return;
      },
    },
    createdAt: { type: GraphQLString },
    updatedAt: { type: GraphQLString },
  },
});

export const blogListType = new GraphQLObjectType({
  name: "blogListType",
  fields: {
    page: { type: GraphQLNonNull(GraphQLInt) },
    limit: { type: GraphQLNonNull(GraphQLInt) },
    totalCount: { type: GraphQLNonNull(GraphQLInt) },
    blogs: { type: GraphQLList(BlogType) },
  },
});
