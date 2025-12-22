import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { StatsServices } from "./stats.service";
import { JwtPayload } from "jsonwebtoken";

const getUserStats = catchAsync(async (req: Request, res: Response) => {
    const result = await StatsServices.getUserStats(req.user as JwtPayload);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "User Stats",
        data: result,
    });
});

const getFavoriteFoldersFiles = catchAsync(async (req: Request, res: Response) => {
    const result = await StatsServices.getFavoriteFoldersFiles(req.user as JwtPayload);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Favorite Folders & Files",
        data: result,
    });
});

const getUserRecentActivity = catchAsync(async (req: Request, res: Response) => {
    const result = await StatsServices.getUserRecentActivity(req.user as JwtPayload);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "User Recent Activity",
        data: result,
    });
});

const getUserActivityBySingleDate = catchAsync(async (req: Request, res: Response) => {
    const date = req.query.date
    const result = await StatsServices.getUserActivityBySingleDate(req.user as JwtPayload, date as string);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "User Recent Activity",
        data: result,
    });
});

export const StatsControllers = {
    getUserStats,
    getFavoriteFoldersFiles,
    getUserRecentActivity,
    getUserActivityBySingleDate
}