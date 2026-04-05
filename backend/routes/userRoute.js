import express from "express";
import {
  forgotPassword,
  getSavedProducts,
  getUserById,
  isProductSaved,
  registerUser,
  resendOTP,
  resetPassword,
  saveProduct,
  unsaveProduct,
  updateUser,
  UserLogin,
  UserLogout,
  verifyEmail,
  verifyForgotPasswordOTP,
} from "../controllers/userController.js";
import { isAuthenticated } from "../middleware/isAuthenticated.js";
import { singleUpload } from "../middleware/multer.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/verify-email/", verifyEmail);
router.post("/resend-otp", resendOTP);
router.post("/login", UserLogin);
router.post("/logout", isAuthenticated, UserLogout);
router.post("/forgot-password", forgotPassword);
router.post("/verify-reset-password-otp", verifyForgotPasswordOTP);
router.post("/reset-password", resetPassword);
router.put("/update/:id", isAuthenticated, singleUpload, updateUser);
router.post("/saveProduct/:productId", isAuthenticated, saveProduct);
router.get("/isSaved/:productId", isAuthenticated, isProductSaved);
router.delete("/UnsaveProduct/:productId", isAuthenticated, unsaveProduct);
router.get("/getsavedProducts", isAuthenticated, getSavedProducts);
router.get("/:id", isAuthenticated, getUserById);

export default router;