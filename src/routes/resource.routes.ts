import express, { Router } from 'express'
import { resourceController } from '../controllers/resource.controller'
import { asyncHandler } from '../utils/handler.util'
import { rootRoleGuard } from '../middlewares/role-guard.middleware'
import { validateBody, validateQueryParams } from '../middlewares/validator.middleware'
import { queryFilterDto } from '../dto/filter.dto'
import {
  AddResourceUserDto,
  CreateResourceDto,
  DeleteResourceDto,
  UpdateResourceDto,
  UpdateResourcePermissionDto,
  UpdateResourceUserDto
} from '../dto/resource.dto'

const router: Router = express.Router({ mergeParams: true })

// get all resources
router.get(
  '/',
  rootRoleGuard(['superadmin', 'admin']),
  validateQueryParams(queryFilterDto),
  asyncHandler(resourceController.getAllResources)
)

// get single resource
router.get(
  '/:resourceId',
  rootRoleGuard(['superadmin', 'admin']),
  validateQueryParams(queryFilterDto),
  asyncHandler(resourceController.getResourceById)
)

// create resource
router.post(
  '/',
  rootRoleGuard(['superadmin', 'admin']),
  validateBody(CreateResourceDto),
  asyncHandler(resourceController.createResource)
)

// update resource
router.patch(
  '/:resourceId',
  rootRoleGuard(['superadmin', 'admin']),
  validateBody(UpdateResourceDto),
  asyncHandler(resourceController.updateResource)
)

// delete resource
router.delete(
  '/:resourceId',
  rootRoleGuard(['superadmin', 'admin']),
  validateBody(DeleteResourceDto),
  asyncHandler(resourceController.deleteResource)
)

// get users from resource
router.get(
  '/:resourceId/users',
  rootRoleGuard(['superadmin', 'admin']),
  validateQueryParams(queryFilterDto),
  asyncHandler(resourceController.getResourceUsers)
)

router.post(
  '/:resourceId/users',
  rootRoleGuard(['superadmin', 'admin']),
  validateBody(AddResourceUserDto),
  asyncHandler(resourceController.addResourceUsers)
)

router.patch(
  '/:resourceId/users/:userId',
  rootRoleGuard(['superadmin', 'admin']),
  validateBody(UpdateResourceUserDto),
  asyncHandler(resourceController.updateResourceUsers)
)

router.delete(
  '/:resourceId/users/:userId',
  rootRoleGuard(['superadmin', 'admin']),
  asyncHandler(resourceController.removeResourceUsers)
)

// return roles + permissions for a resource
router.get(
  '/:resourceId/roles/',
  rootRoleGuard(['superadmin', 'admin']),
  asyncHandler(resourceController.getResourceRoles)
)

// assign role + permissions to a resource.
// accepts like:  { add: [1, 2], remove: [3] }
router.patch(
  '/:resourceId/roles/:roleId',
  rootRoleGuard(['superadmin', 'admin']),
  validateBody(UpdateResourcePermissionDto),
  asyncHandler(resourceController.updateResourceRoles)
)

export { router as resourceRoutes }
