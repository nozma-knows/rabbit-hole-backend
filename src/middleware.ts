import cors from "cors";
import { expressjwt } from "express-jwt";

module.exports = [
  cors({
    credentials: true,
  }),
  expressjwt({
    secret: `${process.env.JWT_PRIVATE_KEY}`,
    algorithms: ["HS256"],
    credentialsRequired: false,
  }),
];
