import z from "zod";

export const createFolderZodSchema = z.object({
    name: z
        .string()
        .refine(val => typeof val === "string", { message: "Name must be a string value" })
        .min(2, { message: "Name too short. Minimum characters 2 long" })
        .max(50, { message: "Name too long. Maximum 50 characters" }),
})

export const updateFolderZodSchema = createFolderZodSchema.partial()