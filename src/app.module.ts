import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { RolesModule } from './roles/roles.module';
import { ResourcesModule } from './resources/resources.module';
import { GroupsModule } from './groups/groups.module';
import { ActionsModule } from './actions/actions.module';
import { GroupRolesModule } from './group-roles/group-roles.module';
import { ResourceRolesModule } from './resource-roles/resource-roles.module';
import { ResourceRolePermissionsModule } from './resource-role-permissions/resource-role-permissions.module';

@Module({
  imports: [
    UsersModule,
    RolesModule,
    ResourcesModule,
    GroupsModule,
    ActionsModule,
    GroupRolesModule,
    ResourceRolesModule,
    ResourceRolePermissionsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
