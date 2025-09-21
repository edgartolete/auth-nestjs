import express, { Router } from 'express'
import { appController } from '../controllers/app.controller'
import { asyncHandler } from '../utils/handler.util'
import { rootRoleGuard } from '../middlewares/role-guard.middleware'
import { queryFilterDto } from '../dto/filter.dto'
import { validateBody, validateQueryParams } from '../middlewares/validator.middleware'
import { CreateAppDto, DeleteAppDto, UpdateAppDto } from '../dto/app.dto'
import { upload } from '../middlewares/upload.middleware'
import { LoginAuthDto } from '../dto/auth.dto'
import { authTokenGuard } from '../middlewares/auth-token.middleware'

const router: Router = express.Router({ mergeParams: true })

router.get(
  '/',
  rootRoleGuard(['superadmin']),
  authTokenGuard,
  validateQueryParams(queryFilterDto),
  asyncHandler(appController.getAllApps)
)

router.get(
  '/:appCode',
  authTokenGuard,
  rootRoleGuard(['superadmin']),
  validateQueryParams(queryFilterDto),
  asyncHandler(appController.getAppById)
)

router.post(
  '/',
  authTokenGuard,
  rootRoleGuard(['superadmin']),
  validateBody(CreateAppDto),
  asyncHandler(appController.createApp)
)

router.patch(
  '/:appCode',
  authTokenGuard,
  rootRoleGuard(['superadmin']),
  validateBody(UpdateAppDto),
  asyncHandler(appController.updateApp)
)

router.delete(
  '/:appCode',
  authTokenGuard,
  rootRoleGuard(['superadmin']),
  validateBody(DeleteAppDto),
  asyncHandler(appController.deleteApp)
)

router.post('/login', upload.none(), validateBody(LoginAuthDto), asyncHandler(appController.login))

router.post(
  '/logout',
  upload.none(),

  authTokenGuard,
  asyncHandler(appController.logout)
)

export { router as appRoutes }
