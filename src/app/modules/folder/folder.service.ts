import { JwtPayload } from "jsonwebtoken"
import { IFolder } from "./folder.interface"
import { Folder } from "./folder.model"
import { User } from "../user/user.model"
import AppError from "../../errorHelpers/AppError"
import httpStatus from "http-status-codes"
import { envVars } from "../../config/env"
import bcryptjs from "bcryptjs"

const createFolder = async (payload: Partial<IFolder>, user: JwtPayload) => {
    const isUserExist = await User.findById(user?.userId)

    if (!isUserExist) {
        throw new AppError(httpStatus.NOT_FOUND, "User Not Found!!")
    }

    const folderPayload: IFolder = {
        name: payload.name as string,
        owner: user.userId
    }

    const newFolder = await Folder.create(folderPayload)

    return newFolder
}

const getOwnerWiseFolders = async (user: JwtPayload) => {
    const isUserExist = await User.findById(user?.userId)

    if (!isUserExist) {
        throw new AppError(httpStatus.NOT_FOUND, "User Not Found!!")
    }

    const folders = await Folder.find({ owner: user?.userId, isDeleted: false, protected: false }).select("-fileUrls").lean()

    const transformFolders = folders.map((folder, index) => ({
        items: folder.fileUrls?.length ?? 0,
        ...folder
    }))

    return transformFolders
}

const getSingleFolder = async (folderId: string, user: JwtPayload) => {
    const isUserExist = await User.findById(user?.userId)

    if (!isUserExist) {
        throw new AppError(httpStatus.NOT_FOUND, "User Not Found!!")
    }

    const folder = await Folder.findOne({ _id: folderId, isDeleted: false, protected: false, owner: user?.userId }).populate("fileUrls")

    if (!folder) {
        throw new AppError(httpStatus.NOT_FOUND, "Folder Not Found!!")
    }

    return folder
}

const updateFolder = async (folderId: string, payload: { name: string }, user: JwtPayload) => {
    const isUserExist = await User.findById(user?.userId)

    if (!isUserExist) {
        throw new AppError(httpStatus.NOT_FOUND, "User Not Found!!")
    }

    const folder = await Folder.findOneAndUpdate({ _id: folderId, isDeleted: false, protected: false, owner: user?.userId }, payload, { new: true, runValidators: true })

    if (!folder) {
        throw new AppError(httpStatus.NOT_FOUND, "Folder Not Found!!")
    }

    await folder.save()

    return folder
}

const deleteSingleFolder = async (folderId: string, user: JwtPayload) => {
    const isUserExist = await User.findById(user?.userId)

    if (!isUserExist) {
        throw new AppError(httpStatus.NOT_FOUND, "User Not Found!!")
    }

    const folder = await Folder.findOne({ _id: folderId, isDeleted: false, protected: false, owner: user?.userId })

    if (!folder) {
        throw new AppError(httpStatus.NOT_FOUND, "Folder Not Found!!")
    }

    folder.isDeleted = true
    await folder.save()

    return folder
}

const duplicateFolder = async (folderId: string, user: JwtPayload) => {
    const isUserExist = await User.findById(user?.userId)

    if (!isUserExist) {
        throw new AppError(httpStatus.NOT_FOUND, "User Not Found!!")
    }

    const folder = await Folder.findOne({ _id: folderId, isDeleted: false, owner: user?.userId })

    if (!folder) {
        throw new AppError(httpStatus.NOT_FOUND, "Folder Not Found!!")
    }

    const withoutNameFolder = await Folder.findOne({ _id: folderId, isDeleted: false, owner: user?.userId }).select("-name").select("-owner")

    const duplicateFolder = await Folder.create({
        name: `${folder.name} Copy`,
        owner: user?.userId,
        ...withoutNameFolder
    })

    return duplicateFolder
}

const setProtectedFolder = async (folderId: string, user: JwtPayload) => {
    const isUserExist = await User.findById(user?.userId)

    if (!isUserExist) {
        throw new AppError(httpStatus.NOT_FOUND, "User Not Found!!")
    }

    const folder = await Folder.findOne({ _id: folderId, isDeleted: false, protected: false, owner: user?.userId })

    if (!folder) {
        throw new AppError(httpStatus.NOT_FOUND, "Folder Not Found!!")
    }

    folder.protected = true
    await folder.save()

    return folder
}

const setProtectedFolderPIN = async (payload: { pin: string }, user: JwtPayload) => {
    const isUserExist = await User.findById(user?.userId)

    if (!isUserExist) {
        throw new AppError(httpStatus.NOT_FOUND, "User Not Found!!")
    }

    if (isUserExist.protectedFolderPin) {
        throw new AppError(httpStatus.BAD_REQUEST, "You Already Set Protected Folder PIN")
    }

    if (payload.pin.length > 4 || payload.pin.length < 4) {
        throw new AppError(httpStatus.BAD_REQUEST, "PIN Must Be 4 Digit!!")
    }

    const hashedPIN = await bcryptjs.hash(payload.pin!, Number(envVars.BCRYPT_SALT_ROUND))

    isUserExist.protectedFolderPin = hashedPIN
    await isUserExist.save()
}

const forgotProtectedFolderPIN = async (payload: { pin: string }, user: JwtPayload) => {
    const isUserExist = await User.findById(user?.userId)

    if (!isUserExist) {
        throw new AppError(httpStatus.NOT_FOUND, "User Not Found!!")
    }

    if (payload.pin.length > 4 || payload.pin.length < 4) {
        throw new AppError(httpStatus.BAD_REQUEST, "PIN Must Be 4 Digit!!")
    }

    const hashedPIN = await bcryptjs.hash(payload.pin!, Number(envVars.BCRYPT_SALT_ROUND))

    isUserExist.protectedFolderPin = hashedPIN
    await isUserExist.save()
}

export const FolderServices = {
    createFolder,
    getOwnerWiseFolders,
    getSingleFolder,
    updateFolder,
    deleteSingleFolder,
    duplicateFolder,
    setProtectedFolder,
    setProtectedFolderPIN,
    forgotProtectedFolderPIN
}