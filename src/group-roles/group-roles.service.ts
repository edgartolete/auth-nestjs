import { Injectable } from '@nestjs/common';
import { CreateGroupRoleDto } from './dto/create-group-role.dto';
import { UpdateGroupRoleDto } from './dto/update-group-role.dto';

@Injectable()
export class GroupRolesService {
  create(createGroupRoleDto: CreateGroupRoleDto) {
    return 'This action adds a new groupRole';
  }

  findAll() {
    return `This action returns all groupRoles`;
  }

  findOne(id: number) {
    return `This action returns a #${id} groupRole`;
  }

  update(id: number, updateGroupRoleDto: UpdateGroupRoleDto) {
    return `This action updates a #${id} groupRole`;
  }

  remove(id: number) {
    return `This action removes a #${id} groupRole`;
  }
}
