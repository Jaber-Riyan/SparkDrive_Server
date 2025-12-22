import z from "zod";

export const createFileSchema = z.object({
    type: z.string().min(1),
    folderId: z.string()
});

export const updateFileSchema = z.object({
    name: z.string().refine(val => typeof val === "string", { message: "Name must be string" })
        .min(2, { message: "Name must be at least 2 characters long." })
        .max(50, { message: "Name cannot exceed 50 characters." }).optional()
})