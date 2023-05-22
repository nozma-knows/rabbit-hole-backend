// Prisma
// Bull
// Redis

const ApolloServer = require("@apollo/server");
const expressMiddleware = require("@apollo/server/express4");
import cors from "cors";
import express from "express";
import { PrismaClient } from "@prisma/client";
import { readFileSync } from "fs";
import { resolvers } from "./graph/resolvers";
import bodyParser from "body-parser";
import { createServer } from "http";

const app = express();

const typeDefs = readFileSync("./src/graph/schema.graphql", {
  encoding: "utf-8",
});

const startServer = async () => {
  const prisma = new PrismaClient();

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: async () => ({
      prisma, // prisma client
    }),
  });

  await server.start();

  const httpServer = createServer(app);

  // Set up our Express middleware to handle CORS, body parsing,
  // and our expressMiddleware function.
  app.use(
    "/",
    cors<cors.CorsRequest>(),
    bodyParser.json(),
    // expressMiddleware accepts the same arguments:
    // an Apollo Server instance and optional configuration options
    expressMiddleware(server, {
      context: async () => ({ prisma }),
    })
  );

  // Modified server startup
  await new Promise<void>((resolve) =>
    httpServer.listen({ port: 4000 }, resolve)
  );
  console.log(`🚀 Server ready at http://localhost:4000/`);
};

startServer();
