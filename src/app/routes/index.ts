import { Router } from "express";
import { UserRoutes } from "../modules/user/user.route";
import { AuthRoutes } from "../modules/auth/auth.route";
import { OtpRoutes } from "../modules/otp/otp.route";
import { FolderRoutes } from "../modules/folder/folder.route";
import { FileRoutes } from "../modules/file/file.route";
import { StatsRoutes } from "../modules/stats/stats.route";

export const router = Router()

export interface IModuleRoutes {
    path: string
    route: Router
}

const moduleRoutes: IModuleRoutes[] = [
    {
        path: "/users",
        route: UserRoutes
    },
    {
        path: "/auth",
        route: AuthRoutes
    },
    {
        path: "/otp",
        route: OtpRoutes
    },
    {
        path: "/folders",
        route: FolderRoutes
    },
    {
        path: "/files",
        route: FileRoutes
    },
    {
        path: "/stats",
        route: StatsRoutes
    }
]


moduleRoutes.forEach((route) => {
    router.use(route.path, route.route)
})
