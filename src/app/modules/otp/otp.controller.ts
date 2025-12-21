import type { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { OTPService } from "./otp.service";


const sendVerificationOTP = catchAsync(async (req: Request, res: Response) => {

    const { email } = req.body

    await OTPService.sendVerificationOTP(email)

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "OTP Sent Successfully",
        data: null,
    });
})

const verifyVerificationOTP = catchAsync(async (req: Request, res: Response) => {

    const { email, otp } = req.body

    await OTPService.verifyVerificationOTP(email, otp)

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "OTP Verified Successfully",
        data: null,
    });
})

const sendForgotPasswordOTP = catchAsync(async (req: Request, res: Response) => {

    const { email } = req.body

    await OTPService.sendForgotPasswordOTP(email)

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "OTP Sent Successfully",
        data: null,
    });
})

const verifyForgotPasswordOTP = catchAsync(async (req: Request, res: Response) => {

    const { email, otp } = req.body

    await OTPService.verifyForgotPasswordOTP(email, otp)

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "OTP Verified Successfully",
        data: null,
    });
})

const sendForgotProtectedFolderPinOTP = catchAsync(async (req: Request, res: Response) => {

    const { email } = req.body

    await OTPService.sendForgotProtectedFolderPinOTP(email)

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "OTP Sent Successfully",
        data: null,
    });
})

const verifyForgotProtectedFolderPinOTP = catchAsync(async (req: Request, res: Response) => {

    const { email, otp } = req.body

    await OTPService.verifyForgotProtectedFolderPinOTP(email, otp)

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "OTP Verified Successfully",
        data: null,
    });
})

export const OTPController = {
    sendVerificationOTP,
    verifyVerificationOTP,
    sendForgotPasswordOTP,
    verifyForgotPasswordOTP,
    sendForgotProtectedFolderPinOTP,
    verifyForgotProtectedFolderPinOTP
};