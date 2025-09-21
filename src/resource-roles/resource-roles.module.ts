import { Module } from '@nestjs/common';
import { ResourceRolesService } from './resource-roles.service';
import { ResourceRolesController } from './resource-roles.controller';

@Module({
  controllers: [ResourceRolesController],
  providers: [ResourceRolesService],
})
export class ResourceRolesModule {}
