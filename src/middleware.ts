import { expressjwt } from "express-jwt";

module.exports = [
  function (req: any, res: any, next: any) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );
    next();
  },
  expressjwt({
    secret: `${process.env.JWT_PRIVATE_KEY}`,
    algorithms: ["HS256"],
    credentialsRequired: false,
  }),
];
