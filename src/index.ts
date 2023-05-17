import { createServer } from "http";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import { readFileSync } from "fs";
import { resolvers } from "./graph/resolvers";
import { expressjwt } from "express-jwt";
import { PrismaClient } from "@prisma/client";
import cors from "cors";

const typeDefs = readFileSync("./src/graph/schema.graphql", {
  encoding: "utf-8",
});

const startServer = async () => {
  const app = express();
  app.use(
    cors({ origin: "*" }),
    expressjwt({
      secret: `${process.env.JWT_PRIVATE_KEY}`,
      algorithms: ["HS256"],
      credentialsRequired: false,
    })
  );
  const httpServer = createServer(app);

  const prisma = new PrismaClient();

  const apolloServer = new ApolloServer({
    typeDefs,
    resolvers,
    context: async ({ req, res }) => ({
      prisma, // prisma client
      userId: req.headers.userId, // user id from token
      expiry: req.headers.expiry, // expiry from token
      token: req.headers.authorization?.split("Bearer ")[1], // token
    }),
  });

  await apolloServer.start();

  apolloServer.applyMiddleware({
    app,
    path: "/api",
  });

  httpServer.listen({ port: process.env.PORT || 4000 }, () =>
    console.log(`Server listening on localhost:4000${apolloServer.graphqlPath}`)
  );
};

startServer();
