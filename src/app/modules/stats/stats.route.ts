import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";
import { StatsControllers } from "./stats.controller";

const router = Router()

// Get User Stat
router.get("/user/stats", checkAuth(...Object.values(Role)), StatsControllers.getUserStats)

// Get Favorite Folders & Files
router.get("/user/favorite/folders-files", checkAuth(...Object.values(Role)), StatsControllers.getFavoriteFoldersFiles)

// Get User Activity
router.get("/user/recent/activity", checkAuth(...Object.values(Role)), StatsControllers.getUserRecentActivity)

// Get Day Wise Activity
router.get("/user/activity/by-date", checkAuth(...Object.values(Role)), StatsControllers.getUserActivityBySingleDate)

export const StatsRoutes = router