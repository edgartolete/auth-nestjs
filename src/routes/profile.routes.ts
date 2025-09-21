import express, { Router } from 'express'
import { profileController } from '../controllers/profile.controller'
import { upload } from '../middlewares/upload.middleware'
import { validateBody } from '../middlewares/validator.middleware'
import { UpdateProfileDto } from '../dto/profile.dto'
import { asyncHandler } from '../utils/handler.util'
import { authTokenGuard } from '../middlewares/auth-token.middleware'
import { rootRoleGuard } from '../middlewares/role-guard.middleware'

const router: Router = express.Router({ mergeParams: true })

router.patch(
  '/:id',
  authTokenGuard,
  rootRoleGuard(['superadmin', 'admin', 'self']),
  upload.single('file'),
  validateBody(UpdateProfileDto),
  asyncHandler(profileController.updateProfile)
)

export { router as profileRoutes }
