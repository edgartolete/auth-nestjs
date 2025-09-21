import { Injectable } from '@nestjs/common';
import { CreateResourceRoleDto } from './dto/create-resource-role.dto';
import { UpdateResourceRoleDto } from './dto/update-resource-role.dto';

@Injectable()
export class ResourceRolesService {
  create(createResourceRoleDto: CreateResourceRoleDto) {
    return 'This action adds a new resourceRole';
  }

  findAll() {
    return `This action returns all resourceRoles`;
  }

  findOne(id: number) {
    return `This action returns a #${id} resourceRole`;
  }

  update(id: number, updateResourceRoleDto: UpdateResourceRoleDto) {
    return `This action updates a #${id} resourceRole`;
  }

  remove(id: number) {
    return `This action removes a #${id} resourceRole`;
  }
}
