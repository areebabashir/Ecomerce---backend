import express from "express";

import {
  registerController,
  loginController,
  testController,
  forgotPasswordController,
  getAllUsers,
  updateProfileController,
} from "../controllers/authController.js";
import { requireSignIn, isAdmin } from "../middlewares/authMiddleware.js";
//router object
const router = express.Router();

//get all user
router.get("/all", getAllUsers);


//routing
//REGISTER || METHOD POST
router.post("/register", registerController);

router.get("/all", getAllUsers)

//LOGIN 
router.post("/login", loginController);

//forget passworrd || post
router.post("/ForgetPassword", forgotPasswordController);
//test routes
router.get("/test", requireSignIn, isAdmin, testController);

//protected route auth
//user
router.get("/user-auth", requireSignIn, (req, res) => {
  res.status(200).send({ ok: true });
});
//adminn
router.get("/admin-auth", requireSignIn, isAdmin, (req, res) => {
  res.status(200).send({ ok: true });
});

//update profile
router.put("/profile", updateProfileController);




export default router;