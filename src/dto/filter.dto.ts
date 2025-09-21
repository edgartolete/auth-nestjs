import { z } from 'zod'

const numericString = z
  .string()
  .optional()
  .transform((val, ctx) => {
    if (!val) return
    const num = Number(val)
    if (isNaN(num) || num < 1) {
      ctx.addIssue({
        code: 'custom',
        message: 'Page number must be a positive integer'
      })
      return z.NEVER
    }

    return num
  })

export const queryFilterDto = z
  .object({
    pageNum: numericString,
    pageSize: numericString,
    order: z.enum(['asc', 'desc']).optional(),
    keyword: z.string().optional(),
    activeOnly: z.coerce.boolean().optional() // convert string "true/false" to boolean
  })
  .optional()
