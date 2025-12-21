import { model, Schema } from "mongoose";
import { Role, type IAuthProvider, type IUser } from "./user.interface";


const authProviderSchema = new Schema<IAuthProvider>({
    provider: { type: String, required: true },
    providerId: { type: String, required: true }
}, {
    _id: false,
    versionKey: false,
    timestamps: true
})

const userSchema = new Schema<IUser>({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    role: {
        type: String,
        enum: Object.values(Role),
        default: Role.USER
    },
    isDeleted: { type: Boolean, default: false },
    isVerified: { type: Boolean, default: false },
    auths: [authProviderSchema],
    totalStorage: { type: Number, default: 16106127360 },
    usedStorage: { type: Number, default: 0 }
}, {
    timestamps: true,
    versionKey: false
})

export const User = model<IUser>("User", userSchema)