import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import config from "../config/auth.config";
import controller from "../controllers/players.controller";

const verifyToken = (
   req: Request,
   res: Response,
   next: NextFunction
): Response<any, Record<string, any>> | undefined => {
   /*
      UNCOMMENT FOR DEVELOPMENT PURPOSES 
      next();
      return;
   */

   let token: string = req.cookies["jwt"];
   console.log(req.cookies);
   if (!token) return res.status(403).send({ auth: false, message: "No token provided." });

   jwt.verify(token as string, config.secret, (err, decoded) => {
      if (err) {
         return res.status(401).send({ auth: false, message: "Failed to authenticate token." });
      }
      next();
   });
};

export default { verifyToken };
