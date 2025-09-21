import express, { Router } from 'express'
import { roleController } from '../controllers/role.controller'
import { asyncHandler } from '../utils/handler.util'
import { validateBody, validateQueryParams } from '../middlewares/validator.middleware'
import { queryFilterDto } from '../dto/filter.dto'
import { CreateRoleDto, DeleteRoleDto, UpdateRoleDto } from '../dto/role.dto'
import { upload } from '../middlewares/upload.middleware'
import { rootRoleGuard } from '../middlewares/role-guard.middleware'

const router: Router = express.Router({ mergeParams: true })

router.get(
  '/',
  upload.none(),
  rootRoleGuard(['superadmin', 'admin']),
  validateQueryParams(queryFilterDto),
  asyncHandler(roleController.getAllRoles)
)
router.get(
  '/:id',
  rootRoleGuard(['superadmin', 'admin']),
  validateQueryParams(queryFilterDto),
  asyncHandler(roleController.getRoleById)
)

router.post(
  '/',
  upload.none(),
  rootRoleGuard(['superadmin']),
  validateBody(CreateRoleDto),
  asyncHandler(roleController.createRole)
)
router.patch(
  '/:id',
  upload.none(),
  rootRoleGuard(['superadmin']),
  validateBody(UpdateRoleDto),
  asyncHandler(roleController.updateRole)
)
router.delete(
  '/:id',
  upload.none(),
  rootRoleGuard(['superadmin']),
  validateBody(DeleteRoleDto),
  asyncHandler(roleController.deleteRole)
)

export { router as roleRoutes }
