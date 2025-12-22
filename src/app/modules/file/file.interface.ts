import { Types } from "mongoose"

export enum FileType {
    note = "note",
    image = "image",
    pdf = "pdf"
}

export interface IFile {
    name: string
    size: number
    type: FileType
    url: string
    owner: Types.ObjectId
    folder: Types.ObjectId
    isDeleted: boolean
    favorite?: boolean
}