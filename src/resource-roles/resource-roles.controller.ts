import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ResourceRolesService } from './resource-roles.service';
import { CreateResourceRoleDto } from './dto/create-resource-role.dto';
import { UpdateResourceRoleDto } from './dto/update-resource-role.dto';

@Controller('resource-roles')
export class ResourceRolesController {
  constructor(private readonly resourceRolesService: ResourceRolesService) {}

  @Post()
  create(@Body() createResourceRoleDto: CreateResourceRoleDto) {
    return this.resourceRolesService.create(createResourceRoleDto);
  }

  @Get()
  findAll() {
    return this.resourceRolesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.resourceRolesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateResourceRoleDto: UpdateResourceRoleDto) {
    return this.resourceRolesService.update(+id, updateResourceRoleDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.resourceRolesService.remove(+id);
  }
}
