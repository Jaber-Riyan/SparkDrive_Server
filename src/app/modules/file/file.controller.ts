import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status-codes"
import { FileServices } from "./file.service";
import { JwtPayload } from "jsonwebtoken";

const createFile = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const payload = {
        ...req.body,
        url: req.file?.path,
        imageInfo: req.file
    }

    const result = await FileServices.createFile(payload, req.user as JwtPayload)

    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        message: "File Create Successfully",
        success: true,
        data: result
    })
})

const showOwnerWiseFile = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const result = await FileServices.showOwnerWiseFile(req.user as JwtPayload)

    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        message: "Files Retrieved Successfully",
        success: true,
        data: result
    })
})

const getSingleFile = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const result = await FileServices.getSingleFile(req.params.id, req.user as JwtPayload)

    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        message: "File Retrieved Successfully",
        success: true,
        data: result
    })
})

const updateFile = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const result = await FileServices.updateFile(req.params.id, req.user as JwtPayload, req.body)

    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        message: "File Updated Successfully",
        success: true,
        data: result
    })
})

const duplicateFile = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const result = await FileServices.duplicateFile(req.params.id, req.user as JwtPayload)

    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        message: "File Duplicate Successfully",
        success: true,
        data: result
    })
})

const deleteSingleFile = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const result = await FileServices.deleteSingleFile(req.params.id, req.user as JwtPayload)

    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        message: "File Deleted Successfully",
        success: true,
        data: result
    })
})

const markFavoriteFile = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const result = await FileServices.markFavoriteFile(req.params.id, req.user as JwtPayload)

    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        message: "Mark File As Favorite Successfully",
        success: true,
        data: result
    })
})

const markUnFavoriteFile = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const result = await FileServices.markUnFavoriteFile(req.params.id, req.user as JwtPayload)

    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        message: "Mark File As Un Favorite Successfully",
        success: true,
        data: result
    })
})

export const FileControllers = {
    createFile,
    showOwnerWiseFile,
    getSingleFile,
    updateFile,
    duplicateFile,
    deleteSingleFile,
    markFavoriteFile,
    markUnFavoriteFile
}