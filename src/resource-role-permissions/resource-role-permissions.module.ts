import { Module } from '@nestjs/common';
import { ResourceRolePermissionsService } from './resource-role-permissions.service';
import { ResourceRolePermissionsController } from './resource-role-permissions.controller';

@Module({
  controllers: [ResourceRolePermissionsController],
  providers: [ResourceRolePermissionsService],
})
export class ResourceRolePermissionsModule {}
