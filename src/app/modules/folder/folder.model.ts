import { model, Schema } from "mongoose";
import { IFolder } from "./folder.interface";

const folderSchema = new Schema<IFolder>(
    {
        name: { type: String, required: true },
        owner: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        fileUrls: [
            {
                type: Schema.Types.ObjectId,
                ref: "File",
                default: []
            }
        ],
        isDeleted: { type: Boolean, default: false },
        protected: { type: Boolean, default: false },
        favorite: { type: Boolean, default: false },
    },
    {
        timestamps: true,
        versionKey: false
    }
)

export const Folder = model<IFolder>("Folder", folderSchema)
