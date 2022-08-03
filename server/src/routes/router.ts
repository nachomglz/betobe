import express, { Request, Response, Router } from "express";
import { verifySignUp, authJwt } from "../middlewares/index.middlewares";
import multer from "multer";

// Import controllers
import AuthController from "../controllers/auth.controller";
import PlayerController from "../controllers/players.controller";

// Import validator
import validateData from "../middlewares/dataValidation";
import bcrypt from 'bcrypt';

const router: express.Router = Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/players")
    },
    filename: (req, file, cb) => {
        const hashName: string = bcrypt.hashSync(file.fieldname, 10).split("/").join("").split("\\").join("")
        cb(null, hashName + Date.now() + ".jpg")
    }
})

// const upload = multer({ dest: "uploads/players/" });
const upload = multer({storage: storage});

// Admin routes, with /admin prefix
router.post("/admin/signup", [verifySignUp.checkDuplicateUsername], AuthController.signup);
router.post("/admin/signin", AuthController.signin);
router.post("/admin/signout", AuthController.signOut);
router.delete("/admin/remove", AuthController.removeAdmin);
router.get("/admin/all", AuthController.getAllAdmin)
// Auth route

router.get("/validate-token", AuthController.validateToken);

// Players routes, with /players route before endpoint
router.get("/players/get", [authJwt.verifyToken], PlayerController.getPlayers);
router.get("/players/get/:id", [authJwt.verifyToken], PlayerController.getPlayer);
// predelete and preselect players
router.put("/player/set/:id/:status", [authJwt.verifyToken], PlayerController.changeStatus);
router.get("/players/predeleted", [authJwt.verifyToken], PlayerController.getPredeleted);
router.get("/players/preselected", [authJwt.verifyToken], PlayerController.getPreselected);

// Delete player
router.delete("/player/delete/:id", [authJwt.verifyToken], PlayerController.deletePlayer);

// Image routes
router.get("/players/image/:image_name?", PlayerController.getImage);
router.post("/player/postImage/:id", upload.single("image"), PlayerController.postImage);

// Save player in Database
router.post("/player/save", validateData, PlayerController.savePlayer);
export default router;
