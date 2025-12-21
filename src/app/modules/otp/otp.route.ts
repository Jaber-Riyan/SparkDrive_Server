// src/modules/otp/otp.routes.ts
import express from "express";
import { OTPController } from "./otp.controller";

const router = express.Router();

// User Verification 
router.post("/send", OTPController.sendVerificationOTP);
router.post("/verify", OTPController.verifyVerificationOTP);

// Forgot Password Verification
router.post("/send/forgot-password", OTPController.sendForgotPasswordOTP)
router.post("/verify/forgot-password", OTPController.verifyForgotPasswordOTP)

// Forgot Protected Folder PIN Verification
router.post("/send/forgot/protected/folder-pin", OTPController.sendForgotProtectedFolderPinOTP)
router.post("/verify/forgot/protected/folder-pin", OTPController.verifyForgotProtectedFolderPinOTP)


export const OtpRoutes = router;