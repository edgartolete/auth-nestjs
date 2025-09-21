import express, { Router } from 'express'
import { userController } from '../controllers/user.controller'
import { validateBody, validateQueryParams } from '../middlewares/validator.middleware'
import { queryFilterDto } from '../dto/filter.dto'
import { CreateUserDto, DeleteUserDto, UpdateUserDto } from '../dto/user.dto'
import { asyncHandler } from '../utils/handler.util'
import { upload } from '../middlewares/upload.middleware'
import { rootRoleGuard } from '../middlewares/role-guard.middleware'

const router: Router = express.Router({ mergeParams: true })

router.get(
  '/',
  rootRoleGuard(['superadmin', 'admin']),
  validateQueryParams(queryFilterDto),
  asyncHandler(userController.getAllUsers)
)

router.get(
  '/:id',
  rootRoleGuard(['superadmin', 'admin', 'self']),
  asyncHandler(userController.getUserById)
)

router.post(
  '/',
  rootRoleGuard(['superadmin', 'admin', 'self']),
  upload.none(),
  validateBody(CreateUserDto),
  asyncHandler(userController.createUser)
)

router.patch(
  '/:id',
  rootRoleGuard(['superadmin', 'admin', 'self']),
  upload.none(),
  validateBody(UpdateUserDto),
  asyncHandler(userController.updateUser)
)

router.delete(
  '/:id',
  rootRoleGuard(['superadmin', 'admin', 'self']),
  upload.none(),
  validateBody(DeleteUserDto),
  asyncHandler(userController.deleteUser)
)

router.get(
  '/:id/roles',
  rootRoleGuard(['superadmin', 'admin', 'self']),
  asyncHandler(userController.getRoles)
)

export { router as userRoutes }
