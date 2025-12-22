import { model, Schema } from "mongoose";
import { IFile } from "./file.interface";

const fileSchema = new Schema<IFile>(
    {
        name: String,
        size: Number,
        type: String,
        url: String,

        owner: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        folder: {
            type: Schema.Types.ObjectId,
            ref: "Folder",
            required: true,
        },

        isDeleted: { type: Boolean, default: false },
        favorite: { type: Boolean, default: false },
    },
    {
        timestamps: true,
        versionKey: false
    }
);

export const File = model<IFile>("File", fileSchema)
