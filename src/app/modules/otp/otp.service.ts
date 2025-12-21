import crypto from "crypto"
import { User } from "../user/user.model"
import AppError from "../../errorHelpers/AppError"
import { StatusCodes } from "http-status-codes"
import { redisClient } from "../../config/redis.config"
import { sendEmail } from "../../utils/sendEmail"

export const VERIFICATION_OTP_EXPIRATION = 2 * 60
export const FORGOT_PASSWORD_OTP_EXPIRATION = 2 * 60

export const generateOtp = (length = 6) => {
    // 6 Digit OTP
    const otp = crypto.randomInt(10 ** (length - 1), 10 ** length).toString()

    // 10 ** 5 => 10 * 10 *10 *10 *10 * 10 => 1000000

    return otp
}

const sendVerificationOTP = async (email: string) => {
    const user = await User.findOne({ email })

    if (!user) {
        throw new AppError(StatusCodes.NOT_FOUND, "User not found")
    }

    if (user.isVerified) {
        throw new AppError(StatusCodes.BAD_REQUEST, "You are already verified")
    }

    const otp = generateOtp()

    const redisKey = `otp-verification-${email}`

    await redisClient.set(redisKey, otp, {
        expiration: {
            type: "EX",
            value: VERIFICATION_OTP_EXPIRATION
        }
    })

    await sendEmail({
        to: email,
        subject: "Your OTP Code",
        templateName: "otp",
        templateData: {
            name: user.name,
            otp
        }
    })

};

const verifyVerificationOTP = async (email: string, otp: string) => {
    const user = await User.findOne({ email })

    if (!user) {
        throw new AppError(404, "User not found")
    }

    if (user.isVerified) {
        throw new AppError(401, "You are already verified")
    }

    const redisKey = `otp-verification-${email}`

    const savedOtp = await redisClient.get(redisKey)

    if (!savedOtp) {
        throw new AppError(StatusCodes.NOT_FOUND, "Invalid OTP");
    }

    if (savedOtp !== otp) {
        throw new AppError(StatusCodes.NOT_FOUND, "Invalid OTP");
    }

    await Promise.all([
        User.findOneAndUpdate({ email }, { isVerified: true }, { runValidators: true }),
        redisClient.del([redisKey])
    ])

};

const sendForgotPasswordOTP = async (email: string) => {
    const user = await User.findOne({ email })

    if (!user) {
        throw new AppError(StatusCodes.NOT_FOUND, "User not found")
    }

    if (!user.isVerified) {
        throw new AppError(StatusCodes.BAD_REQUEST, "You are not verified user")
    }

    const otp = generateOtp()

    const redisKey = `otp-forgot-password-${email}`

    await redisClient.set(redisKey, otp, {
        expiration: {
            type: "EX",
            value: FORGOT_PASSWORD_OTP_EXPIRATION
        }
    })

    await sendEmail({
        to: email,
        subject: "Your Forgot Password OTP Code",
        templateName: "forgotPassword",
        templateData: {
            name: user.name,
            otp
        }
    })

};

const verifyForgotPasswordOTP = async (email: string, otp: string) => {
    const user = await User.findOne({ email })

    if (!user) {
        throw new AppError(404, "User not found")
    }

    if (!user.isVerified) {
        throw new AppError(401, "You are not verified user")
    }

    const redisKey = `otp-forgot-password-${email}`

    const savedOtp = await redisClient.get(redisKey)

    if (!savedOtp) {
        throw new AppError(StatusCodes.NOT_FOUND, "Invalid OTP");
    }

    if (savedOtp !== otp) {
        throw new AppError(StatusCodes.NOT_FOUND, "Invalid OTP");
    }

    await Promise.all([
        User.findOneAndUpdate({ email }, { isVerified: true }, { runValidators: true }),
        redisClient.del([redisKey])
    ])

};

export const OTPService = {
    sendVerificationOTP,
    verifyVerificationOTP,
    sendForgotPasswordOTP,
    verifyForgotPasswordOTP
}