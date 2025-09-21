import express, { Router } from 'express'
import { authController } from '../controllers/auth.controller'
import { asyncHandler } from '../utils/handler.util'
import { validateBody } from '../middlewares/validator.middleware'
import {
  ForgotRequestAuthDto,
  ForgotSubmitAuthDto,
  LoginAuthDto,
  RegisterAuthDto,
  ResetPasswordAuthDto
} from '../dto/auth.dto'
import { authTokenGuard } from '../middlewares/auth-token.middleware'
import { upload } from '../middlewares/upload.middleware'
import { appCodePipe } from '../middlewares/appcode-pipe.middlware'

const router: Router = express.Router({ mergeParams: true })

router.post(
  '/register',
  upload.none(),
  appCodePipe,
  validateBody(RegisterAuthDto),
  asyncHandler(authController.register)
)
router.post(
  '/login',
  upload.none(),
  appCodePipe,
  validateBody(LoginAuthDto),
  asyncHandler(authController.login)
)
router.post('/logout', authTokenGuard, asyncHandler(authController.logout))
router.post('/refresh', asyncHandler(authController.refreshToken))
router.post(
  '/forgot-request',
  upload.none(),
  validateBody(ForgotRequestAuthDto),
  asyncHandler(authController.forgotRequest)
)
router.post(
  '/forgot-submit',
  upload.none(),
  validateBody(ForgotSubmitAuthDto),
  asyncHandler(authController.forgotSubmit)
)
router.post(
  '/reset-password',
  upload.none(),
  authTokenGuard,
  validateBody(ResetPasswordAuthDto),
  asyncHandler(authController.resetPassword)
)

export { router as authRoutes }
