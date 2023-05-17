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
  // app.use(
  //   expressjwt({
  //     secret: `${process.env.JWT_PRIVATE_KEY}`,
  //     algorithms: ["HS256"],
  //     credentialsRequired: false,
  //   })
  // );
  app.use(
    "/api",
    cors<cors.CorsRequest>({
      origin: ["http://localhost:3000", "https://rabbit-hole-pi.vercel.app"],
      credentials: true,
    })
  );

  const httpServer = createServer(app);

  const prisma = new PrismaClient();

  const apolloServer = new ApolloServer({
    typeDefs,
    resolvers,
    context: async ({ req, res }) => ({
      prisma, // prisma client
      // userId: req.headers.userId, // user id from token
      // expiry: req.headers.expiry, // expiry from token
      // token: req.headers.authorization?.split("Bearer ")[1], // token
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

// import { createServer } from "http";
// import express from "express";
// import { ApolloServer } from "apollo-server-express";
// import { readFileSync } from "fs";
// import { resolvers } from "./graph/resolvers";
// // import { expressjwt } from "express-jwt";
// import { PrismaClient } from "@prisma/client";
// import cors from "cors";
// import { json } from "body-parser";

// const typeDefs = readFileSync("./src/graph/schema.graphql", {
//   encoding: "utf-8",
// });

// const startServer = async () => {
//   const app = express();
//   const httpServer = createServer(app);
//   const prisma = new PrismaClient();
//   const server = new ApolloServer({
//     typeDefs,
//     resolvers,
//     context: async ({ req, res }) => ({
//       prisma, // prisma client
//     }),
//   });
//   await server.start();
//   app.use(
//     "/api",
//     cors<cors.CorsRequest>({
//       origin: ["https://rabbit-hole-pi.vercel.app", "http://localhost:3000"],
//     }),
//     json()
//   );

//   await new Promise<void>((resolve) =>
//     httpServer.listen({ port: 4000 }, resolve)
//   );
//   console.log(`🚀 Server ready at http://localhost:4000/api`);
// };

// startServer();
