import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

import config from "../config/auth.config";
import User from "../models/user.model";

const signup = (req: express.Request, res: express.Response) => {
   const user = new User({
      username: req.body.username,
      password: bcrypt.hashSync(req.body.password, 8),
   });

   user.save((err: Error, user: unknown) => {
      if (err) {
         return res.status(500).send({
            status: "failed",
            message: err.message || "Some error occurred while creating the user.",
         });
      }
      if (user) {
         return res.status(200).send({
            status: "success",
            message: "User created successfully",
            user,
         });
      }
   });
};

const signin = ({ body }: express.Request, res: express.Response) => {
   User.findOne({ username: body.username }, (err: Error, user: any) => {
      if (err) {
         return res.status(500).send({
            status: "failed",
            message: err.message || "Some error occurred while finding the user.",
         });
      }
      if (!user) {
         return res.status(401).send({
            status: "failed",
            message: "Invalid username or password",
         });
      }

      if (bcrypt.compareSync(body.password, user.password)) {

         const token = jwt.sign({ id: user._id }, config.secret, {
            expiresIn: 172800,
         });

         res.cookie("jwt", token, {
            secure: true,
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000,
         });

         return res.status(200).send({
            status: "success",
            message: "Authentication successful!",
         });
      }
      return res.status(404).send({
         status: "failed",
         message: "Invalid username or password",
      });
   });
};

const signOut = (req: express.Request, res: express.Response) => {
   // remove cookie
   let token: string = req.cookies["jwt"];
   if (!token)
      return res.status(403).send({
         status: "failed",
         message: "No token provided!",
      });

   // add token in blacklist
   // code ...

   res.cookie("jwt", null, { maxAge: 0 });
   res.send({
      status: "success",
      message: "Session closed successfully",
   });
};

const validateToken = (req: express.Request, res: express.Response, next: express.NextFunction) => {
   let token: string = req.cookies["jwt"];

   if (!token) return res.status(403).send({ auth: false, message: "No token provided." });

   jwt.verify(token as string, config.secret, (err, decoded) => {
      console.log(decoded);
      if (err) {
         return res.status(401).send({ auth: false, message: "Failed to authenticate token." });
      } else {
         return res.status(200).send({ auth: true, decoded });
      }
   });
};

const removeAdmin = (req: express.Request, res: express.Response, next: express.NextFunction) => {
   User.find({ username: "admin" }, (err: Error, users: any) => {
      if (err) {
         return res.status(500).send({
            status: "failed",
            message: err.message || "Some error occurred while finding the users.",
         });
      }
      if (!users || users.length === 0) {
         return res.status(401).send({
            status: "failed",
            message: "There's no admin user",
         });
      }

      users.forEach((item: any) => {
         User.findByIdAndRemove(item._id,{}, (err: any, user: any, res: any) => {
            console.log(err)
            console.log(user)
            console.log(res)
         })
      });

      return res.status(200).send({
         status: "success",
         message: "All admin users deleted"
      })

   });
}

const getAllAdmin = (req: express.Request, res: express.Response) =>  {
   User.find({username: "admin"}, (err: Error, users: any) => {
      if(err){
         return res.status(500).send({
            err
         })
      }

      return res.send({
         users
      })

   })
}


export default { signup, signin, signOut, validateToken, removeAdmin, getAllAdmin };
