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

    const folder = await Folder.findOne({ _id: folderId, isDeleted: false, protected: false, owner: user?.userId }).populate({
        path: "fileUrls",
        match: { isDeleted: false }
    })

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

    const withoutNameOwnerFolder = await Folder.findOne({ _id: folderId, isDeleted: false, owner: user?.userId }).select("-name").select("-owner")

    const duplicateFolder = await Folder.create({
        name: `${folder.name} Copy`,
        owner: user?.userId,
        ...withoutNameOwnerFolder
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

const getProtectedFolders = async (user: JwtPayload) => {
    const isUserExist = await User.findById(user?.userId)

    if (!isUserExist) {
        throw new AppError(httpStatus.NOT_FOUND, "User Not Found!!")
    }

    const folders = await Folder.find({ owner: user?.userId, isDeleted: false, protected: true }).select("-fileUrls").lean()

    const transformFolders = folders.map((folder, index) => ({
        items: folder.fileUrls?.length ?? 0,
        ...folder
    }))

    return transformFolders
}

const markFavoriteFolder = async (fileId: string, user: JwtPayload) => {
    const userInfo = await User.findById(user.userId);
    if (!userInfo) {
        throw new AppError(httpStatus.NOT_FOUND, "User Not Found");
    }

    const folder = await Folder.findOne({
        _id: fileId,
        isDeleted: false,
        owner: user.userId,
    });

    if (!folder) {
        throw new AppError(httpStatus.NOT_FOUND, "Folder Not Found");
    }

    folder.favorite = true;
    await folder.save()

    return folder
}

const markUnFavoriteFolder = async (fileId: string, user: JwtPayload) => {
    const userInfo = await User.findById(user.userId);
    if (!userInfo) {
        throw new AppError(httpStatus.NOT_FOUND, "User Not Found");
    }

    const folder = await Folder.findOne({
        _id: fileId,
        isDeleted: false,
        owner: user.userId,
    });

    if (!folder) {
        throw new AppError(httpStatus.NOT_FOUND, "Folder Not Found");
    }

    folder.favorite = false;
    await folder.save()

    return folder
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
    forgotProtectedFolderPIN,
    getProtectedFolders,
    markFavoriteFolder,
    markUnFavoriteFolder
}