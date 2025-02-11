import express from "express";
import { config } from "dotenv";
import connectDb from "./config/connectDb";
import { graphqlHTTP } from "express-graphql";
import schema from "./handlers/handler";
//dotenv config
config();
connectDb();
const app = express();
app.use("/graphql", graphqlHTTP({ schema: schema, graphiql: true }));
app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
