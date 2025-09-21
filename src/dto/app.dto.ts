import { z } from 'zod'

// ✅ CREATE
export const CreateAppDto = z
  .object({
    code: z.string().min(1, { message: 'Code is required' }).max(10),
    name: z.string().min(1, { message: 'Name is required' }).max(50),
    description: z.string().optional()
  })
  .strict()

export type CreateAppDtoType = z.infer<typeof CreateAppDto>

// ✅ UPDATE
export const UpdateAppDto = z
  .object({
    code: z.string().min(1).max(10).optional(),
    name: z.string().min(1).max(50).optional(),
    description: z.string().optional()
  })
  .strict()

export type UpdateAppDtoType = z.infer<typeof UpdateAppDto>

// ✅ DELETE
export const DeleteAppDto = z
  .object({
    hard: z.boolean().optional()
  })
  .strict()
  .optional()

export type DeleteAppDtoType = z.infer<typeof DeleteAppDto>
