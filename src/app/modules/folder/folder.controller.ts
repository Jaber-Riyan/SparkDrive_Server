import { NextFunction, Request, Response } from "express"
import { catchAsync } from "../../utils/catchAsync"
import { sendResponse } from "../../utils/sendResponse"
import httpStatus from "http-status-codes"
import { FolderServices } from "./folder.service"
import { JwtPayload } from "jsonwebtoken"

const createFolder = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user
    const result = await FolderServices.createFolder(req.body, user as JwtPayload)

    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        message: "Folder Create Successfully",
        success: true,
        data: result
    })
})

const getOwnerWiseFolders = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user
    const result = await FolderServices.getOwnerWiseFolders(user as JwtPayload)

    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        message: "Folders Retrieve Successfully",
        success: true,
        data: result
    })
})

const getSingleFolder = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user
    const id = req.params.id
    const result = await FolderServices.getSingleFolder(id as string, user as JwtPayload)

    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        message: "Folder Retrieve Successfully",
        success: true,
        data: result
    })
})

const updateFolder = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user
    const id = req.params.id
    const result = await FolderServices.updateFolder(id as string, req.body, user as JwtPayload)

    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        message: "Folder Name Updated Successfully",
        success: true,
        data: result
    })
})

const deleteSingleFolder = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user
    const id = req.params.id
    const result = await FolderServices.deleteSingleFolder(id as string, user as JwtPayload)

    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        message: "Folder Deleted Successfully",
        success: true,
        data: null
    })
})

const duplicateFolder = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user
    const id = req.params.id
    const result = await FolderServices.duplicateFolder(id as string, user as JwtPayload)

    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        message: "Folder Duplicated Successfully",
        success: true,
        data: result
    })
})

const setProtectedFolder = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user
    const id = req.params.id
    const result = await FolderServices.setProtectedFolder(id as string, user as JwtPayload)

    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        message: "Mark Folder Protected Successfully",
        success: true,
        data: result
    })
})

const setProtectedFolderPIN = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user
    const result = await FolderServices.setProtectedFolderPIN(req.body, user as JwtPayload)

    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        message: "Protected Folder PIN Set Successfully",
        success: true,
        data: result
    })
})

const forgotProtectedFolderPIN = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user
    const result = await FolderServices.forgotProtectedFolderPIN(req.body, user as JwtPayload)

    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        message: "Protected Folder Forgotten PIN Set Successfully",
        success: true,
        data: result
    })
})

const getProtectedFolders = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const result = await FolderServices.getProtectedFolders(req.user as JwtPayload)

    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        message: "Protected Folders Retrieved Successfully",
        success: true,
        data: result
    })
})

const markFavoriteFolder = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const result = await FolderServices.markFavoriteFolder(req.params.id, req.user as JwtPayload)

    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        message: "Mark Folder As Favorite Successfully",
        success: true,
        data: result
    })
})

const markUnFavoriteFolder = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const result = await FolderServices.markUnFavoriteFolder(req.params.id, req.user as JwtPayload)

    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        message: "Mark Folder As Un Favorite Successfully",
        success: true,
        data: result
    })
})

export const FolderControllers = {
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