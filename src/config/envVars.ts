import { config } from "dotenv";

config();

export default {
  JWT_SECRET: process.env.JWT_SECRET,
};
