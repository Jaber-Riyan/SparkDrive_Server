import { model, Schema } from "mongoose";

const fileSchema = new Schema<IFile>(
    {
        name: String,
        size: Number,
        type: String,
        url: String,

        owner: {
            type: Schema.Types.ObjectId,
            ref: "User",
        },

        folder: {
            type: Schema.Types.ObjectId,
            ref: "Folder",
            required: true,
        },

        isDeleted: { type: Boolean, default: false },
    },
    {
        timestamps: true,
        versionKey: false
    }
);

export const File = model<IFile>("File", fileSchema)
