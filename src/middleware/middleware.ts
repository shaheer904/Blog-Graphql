import jwt from "jsonwebtoken";
import envVars from "../config/envVars";
import User from "../models/Users.model";
import { GraphQLError } from "graphql";

export const authenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return next();
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, envVars.JWT_SECRET);

    let user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(401).json({ message: "Invalid or expired token" });
    }

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

export const isAuthenticated = (context) => {
  if (!context.user) {
    throw new GraphQLError(
      "Unauthorized: You must be logged in to perform this action."
    );
  }
};
