import { Schema, model } from "mongoose";
import { IActivity } from "./stats.interface";

const activitySchema = new Schema<IActivity>(
    {
        owner: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        type: {
            type: String,
            enum: ["folder_create", "file_create"],
            required: true,
        },

        itemId: {
            type: Schema.Types.ObjectId,
            required: true
        },

        name: {
            type: String,
            required: true,
        },

        fileUrl: {
            type: String,
            default: ""
        },

        created: { type: Date, required: true }
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

export const Activity = model<IActivity>("Activity", activitySchema);
