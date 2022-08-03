// Import server modules
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";

// Import server routes
import router from "./routes/router";
// Create express app
const app = express();

//Enable json body parsing and url encoding
app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// Enable cookie-parser
app.use(cookieParser());

// Use express fileupload
/*
app.use(
   fileUpload({
      createParentPath: true,
   })
);
*/

// Activate CORS
app.use(
   cors({
      origin: "http://localhost:3000",
      credentials: true,
      exposedHeaders: ["SET-COOKIE"],
      allowedHeaders: [
         "Origin",
         "X-Requested-With",
         "Content-Type",
         "Accept",
         "Access-Control-Allow-Origin",
         "Access-Control-Allow-Request-Method",
         "Access-Control-Allow-Credentials",
         "Set-Cookie",
      ],
      methods: ["GET", "PUT", "POST", "DELETE"],
   })
);

// Configure routes
app.use("/api", router);

// Export app
export default app;
