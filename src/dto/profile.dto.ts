import { z } from 'zod'

export const UpdateProfileDto = z
  .object({
    firstName: z.string().max(255).optional().nullable(),
    lastName: z.string().max(255).optional().nullable(),
    birthday: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, 'Birthday must be in YYYY-MM-DD format')
      .transform((val) => new Date(val))
      .optional()
      .nullable(),
    avatarUrl: z.url('Invalid avatar URL').max(255).optional().nullable(),
    avatarKey: z.string().max(255).optional().nullable()
  })
  .strict()

export type UpdateProfileDtoType = z.infer<typeof UpdateProfileDto>
