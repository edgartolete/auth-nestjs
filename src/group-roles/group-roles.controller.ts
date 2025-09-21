import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { GroupRolesService } from './group-roles.service';
import { CreateGroupRoleDto } from './dto/create-group-role.dto';
import { UpdateGroupRoleDto } from './dto/update-group-role.dto';

@Controller('group-roles')
export class GroupRolesController {
  constructor(private readonly groupRolesService: GroupRolesService) {}

  @Post()
  create(@Body() createGroupRoleDto: CreateGroupRoleDto) {
    return this.groupRolesService.create(createGroupRoleDto);
  }

  @Get()
  findAll() {
    return this.groupRolesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.groupRolesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateGroupRoleDto: UpdateGroupRoleDto) {
    return this.groupRolesService.update(+id, updateGroupRoleDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.groupRolesService.remove(+id);
  }
}
