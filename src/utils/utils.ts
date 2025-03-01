import jwt from "jsonwebtoken";
import envVars from "../config/envVars";
export const generateToken = (user) => {
  const token = jwt.sign(
    { id: user.id, email: user.email },
    envVars.JWT_SECRET,
    { expiresIn: "1d" }
  );
  return token;
};
