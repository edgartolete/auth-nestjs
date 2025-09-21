import express, { Router } from 'express'
import { actionController } from '../controllers/action.controller'
import { asyncHandler } from '../utils/handler.util'
import { rootRoleGuard } from '../middlewares/role-guard.middleware'
import { validateBody, validateQueryParams } from '../middlewares/validator.middleware'
import { queryFilterDto } from '../dto/filter.dto'
import { CreateActionDto, DeleteActionDto, UpdateActionDto } from '../dto/action.dto'

const router: Router = express.Router({ mergeParams: true })

router.get(
  '/',
  rootRoleGuard(['superadmin', 'admin']),
  validateQueryParams(queryFilterDto),
  asyncHandler(actionController.getAllActions)
)

router.get(
  '/:actionId',
  rootRoleGuard(['superadmin', 'admin']),
  validateQueryParams(queryFilterDto),
  asyncHandler(actionController.getActionById)
)

router.post(
  '/',
  rootRoleGuard(['superadmin', 'admin']),
  validateBody(CreateActionDto),
  asyncHandler(actionController.createAction)
)

router.patch(
  '/:actionId',
  rootRoleGuard(['superadmin', 'admin']),
  validateBody(UpdateActionDto),
  asyncHandler(actionController.updateAction)
)

router.delete(
  '/:actionId',
  rootRoleGuard(['superadmin', 'admin']),
  validateBody(DeleteActionDto),
  asyncHandler(actionController.deleteAction)
)

export { router as actionRoutes }
