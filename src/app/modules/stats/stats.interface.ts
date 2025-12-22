import { Types } from "mongoose";

export type ActivityType =
    | "folder_create"
    | "file_create";

export interface IActivity {
    _id?: Types.ObjectId;

    owner: Types.ObjectId;

    type: ActivityType;

    itemId: Types.ObjectId
    name: string;
    fileUrl?: string;

    created: Date;
}