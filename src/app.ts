import express from "express";
import { config } from "dotenv";
import connectDb from "./config/connectDb";
import { graphqlHTTP } from "express-graphql";
import schema from "./handlers/handler";
import cors from "cors";
import { authenticate } from "./middleware/middleware";
//dotenv config
config();
connectDb();
const app = express();
app.use(cors({ origin: "*" }));
app.use(authenticate);
app.use(
  "/graphql",
  graphqlHTTP(async (req: any) => {
    return {
      schema: schema,
      graphiql: true,
      context: { user: req.user },
    };
  })
);
app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
