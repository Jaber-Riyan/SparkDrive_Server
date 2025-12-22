import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";
import { FileControllers } from "./file.controller";
import { multerUpload } from "../../config/multer.config";
import { validateRequest } from "../../middlewares/validateRequest";
import { createFileSchema } from "./file.validation";

const router = Router()

// Create File
router.post("/create", checkAuth(...Object.values(Role)), multerUpload.single("file"), validateRequest(createFileSchema), FileControllers.createFile)

// Owner Files
router.get("/my-files", checkAuth(...Object.values(Role)), FileControllers.showOwnerWiseFile)

// Single File Show
router.get("/file/:id", checkAuth(...Object.values(Role)), FileControllers.getSingleFile)

// Update File Name
router.post("/update/file/:id", checkAuth(...Object.values(Role)), FileControllers.updateFile)

// Duplicate File
router.post("/duplicate/file/:id", checkAuth(...Object.values(Role)), FileControllers.duplicateFile)

// Delete Single File
router.delete("/delete/file/:id", checkAuth(...Object.values(Role)), FileControllers.deleteSingleFile)

// Mark File As Favorite
router.get("/mark/favorite/file/:id", checkAuth(...Object.values(Role)), FileControllers.markFavoriteFile)

// Mark File As Un Favorite
router.get("/mark/un-favorite/file/:id", checkAuth(...Object.values(Role)), FileControllers.markUnFavoriteFile)


export const FileRoutes = router