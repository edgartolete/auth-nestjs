import { Injectable } from '@nestjs/common';
import { CreateResourceRolePermissionDto } from './dto/create-resource-role-permission.dto';
import { UpdateResourceRolePermissionDto } from './dto/update-resource-role-permission.dto';

@Injectable()
export class ResourceRolePermissionsService {
  create(createResourceRolePermissionDto: CreateResourceRolePermissionDto) {
    return 'This action adds a new resourceRolePermission';
  }

  findAll() {
    return `This action returns all resourceRolePermissions`;
  }

  findOne(id: number) {
    return `This action returns a #${id} resourceRolePermission`;
  }

  update(id: number, updateResourceRolePermissionDto: UpdateResourceRolePermissionDto) {
    return `This action updates a #${id} resourceRolePermission`;
  }

  remove(id: number) {
    return `This action removes a #${id} resourceRolePermission`;
  }
}
