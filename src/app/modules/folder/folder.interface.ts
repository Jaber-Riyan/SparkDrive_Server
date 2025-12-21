import { Types } from "mongoose"

export interface IFolder {
    _id?: Types.ObjectId
    name: string
    owner: Types.ObjectId
    fileUrls?: Types.ObjectId[]
    isDeleted?: boolean
    protected?: boolean
}