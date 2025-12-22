import mongoose from "mongoose";
import { JwtPayload } from "jsonwebtoken"
import { File } from "./file.model"
import { User } from "../user/user.model"
import AppError from "../../errorHelpers/AppError"
import httpStatus from "http-status-codes"
import { Folder } from "../folder/folder.model"

const createFile = async (payload: any, user: JwtPayload) => {
    const session = await File.startSession()
    session.startTransaction()

    try {
        const userInfo = await User.findById(user.userId)

        if (!userInfo) {
            throw new AppError(httpStatus.NOT_FOUND, "User Not Found")
        }

        const folder = await Folder.findById(payload.folderId)

        if (!folder) {
            throw new AppError(httpStatus.NOT_FOUND, "Folder Not Found")
        }


        if (userInfo.usedStorage + payload.imageInfo.size > userInfo?.totalStorage) {
            throw new AppError(httpStatus.FORBIDDEN, "Insufficient storage")
        }

        const newFilePayload = {
            name: payload.imageInfo.originalname,
            size: payload.imageInfo.size,
            type: payload.type,
            url: payload.url,
            owner: user.userId,
            folder: payload.folderId
        }

        const [newFile] = await File.create([newFilePayload], { session })

        folder.fileUrls.push(newFile._id);
        await folder.save({ session });

        userInfo.usedStorage += newFile.size;
        await userInfo.save({ session });

        // Transaction Commit and End the Session
        await session.commitTransaction() // Transaction
        session.endSession()

        return newFile
    } catch (error) {
        await session.abortTransaction() // Rollback
        session.endSession()
        throw error
    }
}

const showOwnerWiseFile = async (user: JwtPayload) => {
    const userInfo = await User.findById(user.userId)

    if (!userInfo) {
        throw new AppError(httpStatus.NOT_FOUND, "User Not Found")
    }

    const files = await File.find({ owner: user.userId, isDeleted: false })

    return files
}

const getSingleFile = async (fileId: string, user: JwtPayload) => {
    const userInfo = await User.findById(user.userId)

    if (!userInfo) {
        throw new AppError(httpStatus.NOT_FOUND, "User Not Found")
    }

    const file = await File.findOne({ _id: fileId, owner: user.userId, isDeleted: false })

    if (!file) {
        throw new AppError(httpStatus.NOT_FOUND, "File Not Found")
    }

    return file
}

const updateFile = async (fileId: string, user: JwtPayload, payload: { name: string }) => {
    const userInfo = await User.findById(user.userId)

    if (!userInfo) {
        throw new AppError(httpStatus.NOT_FOUND, "User Not Found")
    }

    const file = await File.findOneAndUpdate({ _id: fileId, isDeleted: false, owner: user?.userId }, payload, { new: true, runValidators: true })

    if (!file) {
        throw new AppError(httpStatus.NOT_FOUND, "File Not Found")
    }

    return file
}


const duplicateFile = async (fileId: string, user: JwtPayload) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const userInfo = await User.findById(user.userId).session(session);
        if (!userInfo) {
            throw new AppError(httpStatus.NOT_FOUND, "User Not Found");
        }

        const file = await File.findOne({
            _id: fileId,
            isDeleted: false,
            owner: user.userId,
        }).session(session);

        if (!file) {
            throw new AppError(httpStatus.NOT_FOUND, "File Not Found");
        }

        const folder = await Folder.findById(file.folder).session(session);
        if (!folder) {
            throw new AppError(httpStatus.NOT_FOUND, "Folder Not Found");
        }

        if (userInfo.usedStorage + file.size > userInfo.totalStorage) {
            throw new AppError(
                httpStatus.BAD_REQUEST,
                "Insufficient storage"
            );
        }

        const duplicatedFile = await File.create(
            [
                {
                    name: `${file.name} Copy`,
                    size: file.size,
                    type: file.type,
                    url: file.url,
                    owner: user.userId,
                    folder: file.folder,
                },
            ],
            { session }
        );

        folder.fileUrls.push(duplicatedFile[0]._id);
        await folder.save({ session });

        userInfo.usedStorage += file.size;
        await userInfo.save({ session });

        // Commit Transaction
        await session.commitTransaction();
        session.endSession();

        return duplicatedFile[0];
    } catch (error) {
        // Transaction Rollback
        await session.abortTransaction();
        session.endSession();
        throw error;
    }
};

const deleteSingleFile = async (fileId: string, user: JwtPayload) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const userInfo = await User.findById(user.userId).session(session);
        if (!userInfo) {
            throw new AppError(httpStatus.NOT_FOUND, "User Not Found");
        }

        const file = await File.findOne({
            _id: fileId,
            isDeleted: false,
            owner: user.userId,
        }).session(session);

        if (!file) {
            throw new AppError(httpStatus.NOT_FOUND, "File Not Found");
        }

        userInfo.usedStorage = Math.max(
            0,
            userInfo.usedStorage - file.size
        );
        await userInfo.save({ session });

        file.isDeleted = true;
        await file.save({ session });

        // ✅ Commit
        await session.commitTransaction();
        session.endSession();

        return file;
    } catch (error) {
        // ❌ Rollback
        await session.abortTransaction();
        session.endSession();
        throw error;
    }
};

const markFavoriteFile = async (fileId: string, user: JwtPayload) => {
    const userInfo = await User.findById(user.userId);
    if (!userInfo) {
        throw new AppError(httpStatus.NOT_FOUND, "User Not Found");
    }

    const file = await File.findOne({
        _id: fileId,
        isDeleted: false,
        owner: user.userId,
    });

    if (!file) {
        throw new AppError(httpStatus.NOT_FOUND, "File Not Found");
    }

    file.favorite = true;
    await file.save()

    return file
}

const markUnFavoriteFile = async (fileId: string, user: JwtPayload) => {
    const userInfo = await User.findById(user.userId);
    if (!userInfo) {
        throw new AppError(httpStatus.NOT_FOUND, "User Not Found");
    }

    const file = await File.findOne({
        _id: fileId,
        isDeleted: false,
        owner: user.userId,
    });

    if (!file) {
        throw new AppError(httpStatus.NOT_FOUND, "File Not Found");
    }

    file.favorite = false;
    await file.save()

    return file
}

export const FileServices = {
    createFile,
    showOwnerWiseFile,
    getSingleFile,
    updateFile,
    duplicateFile,
    deleteSingleFile,
    markFavoriteFile,
    markUnFavoriteFile
}