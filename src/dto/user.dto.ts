import { z } from 'zod'

export const CreateUserDto = z
  .object({
    appId: z.int().positive().optional(),
    username: z.string().min(1, { message: 'Username is required' }).max(50),
    email: z.email({ message: 'Invalid email format' }).max(100),
    password: z.string().min(6, { message: 'Password must be at least 6 characters' }).max(255),
    isActive: z.boolean().optional()
  })
  .strict()

export type CreateUserDtoType = z.infer<typeof CreateUserDto>

export const UpdateUserDto = z
  .object({
    username: z.string().min(1).max(50).optional(),
    email: z.email({ message: 'Invalid email format' }).max(100).optional(),
    password: z.string().min(6).max(255).optional(),
    roleId: z.number().int().positive().optional(),
    isActive: z.boolean().optional()
  })
  .strict()

export type UpdateUserDtoType = z.infer<typeof UpdateUserDto>

export const DeleteUserDto = z
  .object({
    hard: z.boolean().optional()
  })
  .strict()
  .optional()

export type DeleteUserDtoType = z.infer<typeof DeleteUserDto>
