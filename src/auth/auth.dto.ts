import { z } from 'zod'

export const RegisterAuthDto = z
  .object({
    username: z.string().min(1, { message: 'Username is required' }).max(50),
    email: z.email({ message: 'Invalid email format' }).max(100),
    password: z.string().min(6, { message: 'Password must be at least 6 characters' }).max(255),
    roleId: z.number().int().positive().optional(),
    code: z.string().optional(),
    autoLogin: z.boolean().optional()
  })
  .strict()

export type RegisterAuthDtoType = z.infer<typeof RegisterAuthDto>

export const LoginAuthDto = z
  .object({
    username: z.string().min(1, { message: 'Username is required' }).max(50).optional(),
    email: z.email({ message: 'Invalid email format' }).max(100).optional(),
    password: z.string().min(6, { message: 'Password must be at least 6 characters' }).max(255),
    rememberMe: z.boolean().optional(),
    code: z.string().optional()
  })
  .refine((data) => data.username || data.email, {
    message: 'Either username or email is required',
    path: ['username', 'email']
  })
  .strict()

export type LoginAuthDtoType = z.infer<typeof LoginAuthDto>

export const ForgotRequestAuthDto = z
  .object({
    email: z.email({ message: 'Invalid email format' }).max(100)
  })
  .strict()

export type ForgotRequestAuthDtoType = z.infer<typeof ForgotRequestAuthDto>

export const ForgotSubmitAuthDto = z
  .object({
    email: z.email({ message: 'Invalid email format' }).max(100),
    code: z.string(),
    password: z.string().min(6, { message: 'Password must be at least 6 characters' }).max(255)
  })
  .strict()

export type ForgotSubmitAuthDtoType = z.infer<typeof ForgotSubmitAuthDto>

export const ResetPasswordAuthDto = z
  .object({
    password: z.string().min(6, { message: 'Password must be at least 6 characters' }).max(255)
  })
  .strict()
