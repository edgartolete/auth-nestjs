import { z } from 'zod'

export const CreateRoleDto = z
  .object({
    appId: z.int().positive().optional(),
    name: z.string().min(1, { message: 'Role name is required' }).max(50),
    roleId: z.number().int().positive().optional(),
    isActive: z.boolean().optional()
  })
  .strict()

export type CreateRoleDtoType = z.infer<typeof CreateRoleDto>

export const UpdateRoleDto = z
  .object({
    name: z.string().max(50).optional()
  })
  .strict()

export type UpdateRoleDtoType = z.infer<typeof UpdateRoleDto>

export const ReorderRoleDto = z
  .array(
    z.object({
      id: z.number().int().positive({ message: 'id must be a positive integer' }),
      orderId: z.number().int().positive({ message: 'orderId must be a positive integer' })
    })
  )
  .min(1, { message: 'At least one user must be provided' })
  .superRefine((arr, ctx) => {
    const ids = new Set(arr.map((u) => u.id))
    if (ids.size !== arr.length) {
      ctx.addIssue({
        code: 'custom',
        message: 'Duplicate role ids are not allowed'
      })
    }
  })

export type ReorderRoleDtoType = z.infer<typeof ReorderRoleDto>

export const DeleteRoleDto = z
  .object({
    hard: z.boolean().optional()
  })
  .strict()
  .optional()

export type DeleteRoleDtoType = z.infer<typeof DeleteRoleDto>
