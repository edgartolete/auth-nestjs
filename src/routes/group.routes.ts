import express, { Router } from 'express'
import { groupController } from '../controllers/group.controller'
import { asyncHandler } from '../utils/handler.util'
import { rootRoleGuard } from '../middlewares/role-guard.middleware'
import { validateBody, validateQueryParams } from '../middlewares/validator.middleware'
import { queryFilterDto } from '../dto/filter.dto'
import {
  AddGroupUserDto,
  CreateGroupDto,
  DeleteGroupDto,
  UpdateGroupDto,
  UpdateGroupUserDto
} from '../dto/group.dto'

const router: Router = express.Router({ mergeParams: true })

// get all groups
router.get(
  '/',
  rootRoleGuard(['superadmin', 'admin']),
  validateQueryParams(queryFilterDto),
  asyncHandler(groupController.getAllGroups)
)

// get single group
router.get(
  '/:groupId',
  rootRoleGuard(['superadmin', 'admin']),
  validateQueryParams(queryFilterDto),
  asyncHandler(groupController.getGroupById)
)

// add group
router.post(
  '/',
  rootRoleGuard(['superadmin', 'admin']),
  validateBody(CreateGroupDto),
  asyncHandler(groupController.createGroup)
)

// update group
router.patch(
  '/:groupId',
  rootRoleGuard(['superadmin', 'admin']),
  validateBody(UpdateGroupDto),
  asyncHandler(groupController.updateGroup)
)

// delete group
router.delete(
  '/:groupId',
  rootRoleGuard(['superadmin', 'admin']),
  validateBody(DeleteGroupDto),
  asyncHandler(groupController.deleteGroup)
)

// get all users from a group (DONE)
router.get(
  '/:groupId/users',
  validateQueryParams(queryFilterDto),
  rootRoleGuard(['superadmin', 'admin']),
  asyncHandler(groupController.getGroupUsers)
)

// add user to group
router.post(
  '/:groupId/users',
  validateBody(AddGroupUserDto),
  rootRoleGuard(['superadmin', 'admin']),
  asyncHandler(groupController.addGroupUsers)
)

// update user in group (e.g., change role)
router.patch(
  '/:groupId/users/:userId',
  rootRoleGuard(['superadmin', 'admin']),
  validateBody(UpdateGroupUserDto),
  asyncHandler(groupController.updateGroupUsers)
)

// remove user from group
router.delete(
  '/:groupId/users/:userId',
  rootRoleGuard(['superadmin', 'admin']),
  asyncHandler(groupController.removeGroupUsers)
)

export { router as groupRoutes }
