import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";
import { FolderControllers } from "./folder.controller";
import { validateRequest } from "../../middlewares/validateRequest";
import { createFolderZodSchema, updateFolderZodSchema } from "./folder.validation";

const router = Router()

router.post("/create", checkAuth(...Object.values(Role)), validateRequest(createFolderZodSchema), FolderControllers.createFolder)

router.get("/my-folders", checkAuth(...Object.values(Role)), FolderControllers.getOwnerWiseFolders)

// Protected Folder 
router.get("/protected/folders", checkAuth(...Object.values(Role)), FolderControllers.getProtectedFolders)

router.get("/folder/:id", checkAuth(...Object.values(Role)), FolderControllers.getSingleFolder)

router.patch("/folder/:id", checkAuth(...Object.values(Role)), validateRequest(updateFolderZodSchema), FolderControllers.updateFolder)

router.delete("/folder/:id", checkAuth(...Object.values(Role)), FolderControllers.deleteSingleFolder)

// Duplicate Folder
router.post("/duplicate-folder/:id", checkAuth(...Object.values(Role)), FolderControllers.duplicateFolder)

// Mark Folder Protected
router.get("/mark/protected-folder/:id", checkAuth(...Object.values(Role)), FolderControllers.setProtectedFolder)

// Set Protected Folder PIN
router.post("/set/protected/folder-pin", checkAuth(...Object.values(Role)), FolderControllers.setProtectedFolderPIN)

// Forgot Protected Folder PIN 
router.post("/forgot/protected/folder-pin", checkAuth(...Object.values(Role)), FolderControllers.forgotProtectedFolderPIN)

// Mark Folder As Favorite
router.get("/mark/favorite/folder/:id", checkAuth(...Object.values(Role)), FolderControllers.markFavoriteFolder)

// Mark Folder As Un Favorite
router.get("/mark/un-favorite/folder/:id", checkAuth(...Object.values(Role)), FolderControllers.markUnFavoriteFolder)

export const FolderRoutes = router