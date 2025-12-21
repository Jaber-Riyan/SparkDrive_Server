import { Types } from "mongoose"

export enum Role {
    SUPER_ADMIN = "super_admin",
    ADMIN = "admin",
    USER = "user"
}

export interface IAuthProvider {
    provider: "google" | "credentials"
    providerId: string
}

export interface IUser {
    _id?: Types.ObjectId,
    name: string,
    email: string,
    password?: string,
    role: Role,
    usedStorage?: number,
    totalStorage?: number,
    isDeleted?: boolean,
    isVerified?: boolean,
    auths: IAuthProvider[],
    protectedFolderPin?: string
}