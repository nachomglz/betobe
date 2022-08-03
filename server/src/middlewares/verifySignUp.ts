import { Request, Response, NextFunction } from "express";
import User from "../models/user.model";

const checkDuplicateUsername = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Username
  User.findOne({
    username: req.body.username,
  }).exec((err, user) => {
    if (err) {
      console.log(err);
      return res.status(500).send({ status: "failed", message: err });
    }

    if (user) {
      return res.status(400).send({
        status: "failed",
        error: "Username already exists",
      });
    }
    next();
  });
};

export default {
  checkDuplicateUsername,
};
