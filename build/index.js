"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = require("http");
const express_1 = __importDefault(require("express"));
const apollo_server_express_1 = require("apollo-server-express");
const fs_1 = require("fs");
const resolvers_1 = require("./graph/resolvers");
const express_jwt_1 = require("express-jwt");
const client_1 = require("@prisma/client");
const cors_1 = __importDefault(require("cors"));
const typeDefs = (0, fs_1.readFileSync)("./src/graph/schema.graphql", {
    encoding: "utf-8",
});
const startServer = () => __awaiter(void 0, void 0, void 0, function* () {
    const app = (0, express_1.default)();
    app.use((0, express_jwt_1.expressjwt)({
        secret: `${process.env.JWT_PRIVATE_KEY}`,
        algorithms: ["HS256"],
        credentialsRequired: false,
    }));
    app.use((0, cors_1.default)({
        origin: ["https://rabbit-hole-pi.vercel.app"],
    }));
    const httpServer = (0, http_1.createServer)(app);
    const prisma = new client_1.PrismaClient();
    const apolloServer = new apollo_server_express_1.ApolloServer({
        typeDefs,
        resolvers: resolvers_1.resolvers,
        context: ({ req, res }) => __awaiter(void 0, void 0, void 0, function* () {
            var _a;
            return ({
                prisma,
                userId: req.headers.userId,
                expiry: req.headers.expiry,
                token: (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split("Bearer ")[1], // token
            });
        }),
    });
    yield apolloServer.start();
    apolloServer.applyMiddleware({
        app,
        path: "/api",
    });
    httpServer.listen({ port: process.env.PORT || 4000 }, () => console.log(`Server listening on localhost:4000${apolloServer.graphqlPath}`));
});
startServer();
