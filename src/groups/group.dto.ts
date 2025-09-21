import { z } from 'zod'

// ✅ CREATE
export const CreateGroupDto = z
  .object({
    appId: z.int().positive().optional(),
    name: z.string().min(1, { message: 'Name is required' }).max(50),
    description: z.string().optional()
  })
  .strict()

export type CreateGroupDtoType = z.infer<typeof CreateGroupDto>

// ✅ UPDATE
export const UpdateGroupDto = z
  .object({
    name: z.string().min(1).max(50).optional(),
    description: z.string().optional()
  })
  .strict()

export type UpdateGroupDtoType = z.infer<typeof UpdateGroupDto>

// ✅ DELETE
export const DeleteGroupDto = z
  .object({
    hard: z.boolean().optional()
  })
  .strict()
  .optional()

export type DeleteGroupDtoType = z.infer<typeof DeleteGroupDto>

export const AddGroupUserDto = z
  .object({
    userId: z.number().int().positive(),
    roleId: z.number().int().positive()
  })
  .strict()

export const UpdateGroupUserDto = z
  .object({
    roleId: z.number().int().positive()
  })
  .strict()
