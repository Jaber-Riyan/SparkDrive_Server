import mongoose from "mongoose";
import { User } from "../user/user.model";
import { Folder } from "../folder/folder.model";
import { File } from "../file/file.model";
import { JwtPayload } from "jsonwebtoken";
import { Activity } from "./stats.model";
import AppError from "../../errorHelpers/AppError";
import httpStatus from "http-status-codes"

const getUserStats = async (userInfo: JwtPayload) => {
    // user check
    const userId = userInfo?.userId
    const user = await User.findById(userId)

    if (!user) {
        throw new AppError(httpStatus.NOT_FOUND, "User Not Found!!")
    }

    // Count active folders
    const folders = await Folder.aggregate([
        { $match: { owner: new mongoose.Types.ObjectId(userId), isDeleted: false } },
        {
            $lookup: {
                from: "files",
                localField: "fileUrls",
                foreignField: "_id",
                as: "files",
            },
        },
        {
            $addFields: {
                files: {
                    $filter: {
                        input: "$files",
                        as: "file",
                        cond: { $eq: ["$$file.isDeleted", false] },
                    },
                },
            },
        },
        {
            $project: {
                name: 1,
                fileCount: { $size: "$files" },
                folderStorage: { $sum: "$files.size" },
            },
        },
    ]);

    const folderCount = folders.length;
    const folderStorage = folders.reduce((acc, f) => acc + (f.folderStorage || 0), 0);

    // File stats by type
    const fileStats = await File.aggregate([
        { $match: { owner: new mongoose.Types.ObjectId(userId), isDeleted: false } },
        {
            $group: {
                _id: "$type",
                count: { $sum: 1 },
                storage: { $sum: "$size" }
            },
        },
    ]);

    const fileStatsByType: Record<string, { count: number; storage: number }> = {
        note: { count: 0, storage: 0 },
        pdf: { count: 0, storage: 0 },
        image: { count: 0, storage: 0 },
    };

    fileStats.forEach((f) => {
        fileStatsByType[f._id] = { count: f.count, storage: f.storage };
    });

    // calculate final stats
    const stats = {
        usedStorage: user.usedStorage,
        availableStorage: user.totalStorage! - user.usedStorage!,
        folderCount,
        folderStorage,
        fileStatsByType,
    };

    return stats;
};

const getFavoriteFoldersFiles = async (userInfo: JwtPayload) => {
    const userId = userInfo?.userId
    const user = await User.findById(userId)

    if (!user) {
        throw new AppError(httpStatus.NOT_FOUND, "User Not Found!!")
    }

    const folders = await Folder.find({
        owner: userId,
        favorite: true,
        isDeleted: false,
        protected: false,
    }).select("-fileUrls")

    const files = await File.find({
        owner: userId,
        favorite: true,
        isDeleted: false,
    }).select("-url")

    return { folders, files };
}

const getUserRecentActivity = async (userInfo: JwtPayload) => {
    const userId = userInfo?.userId
    const user = await User.findById(userId)

    if (!user) {
        throw new AppError(httpStatus.NOT_FOUND, "User Not Found!!")
    }

    const activities = await Activity.find({ owner: userId }).limit(5)

    if (!activities) {
        throw new AppError(httpStatus.NOT_FOUND, "User Activities Not Found!!")
    }

    return activities
}

const getUserActivityBySingleDate = async (
    userInfo: JwtPayload,
    date: string
) => {
    const userId = userInfo.userId
    const user = await User.findById(userId)

    if (!user) {
        throw new AppError(httpStatus.NOT_FOUND, "User Not Found!!")
    }

    const startDate = new Date(date);
    startDate.setHours(0, 0, 0, 0);

    const endDate = new Date(date);
    endDate.setHours(23, 59, 59, 999);

    const folders = await Folder.find({
        owner: userId,
        isDeleted: false,
        createdAt: { $gte: startDate, $lte: endDate },
    })
        .select("_id name createdAt")
        .lean();

    const files = await File.find({
        owner: userId,
        isDeleted: false,
        createdAt: { $gte: startDate, $lte: endDate },
    })
        .select("_id name type size url createdAt folder")
        .lean();


    const timeline = [
        ...folders.map((f) => ({
            itemType: "FOLDER_CREATE",
            ...f,
        })),
        ...files.map((f) => ({
            itemType: "FILE_CREATE",
            ...f,
        })),
    ].sort(
        (a: any, b: any) =>
            new Date(b.createdAt).getTime() -
            new Date(a.createdAt).getTime()
    );

    return {
        date,
        totalActions: timeline.length,
        timeline,
    };
};

export const StatsServices = {
    getUserStats,
    getFavoriteFoldersFiles,
    getUserRecentActivity,
    getUserActivityBySingleDate
}
