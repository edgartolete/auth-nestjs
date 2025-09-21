import { Module } from '@nestjs/common';
import { GroupRolesService } from './group-roles.service';
import { GroupRolesController } from './group-roles.controller';

@Module({
  controllers: [GroupRolesController],
  providers: [GroupRolesService],
})
export class GroupRolesModule {}
