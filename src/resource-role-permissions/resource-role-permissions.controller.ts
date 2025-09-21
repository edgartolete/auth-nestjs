import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ResourceRolePermissionsService } from './resource-role-permissions.service';
import { CreateResourceRolePermissionDto } from './dto/create-resource-role-permission.dto';
import { UpdateResourceRolePermissionDto } from './dto/update-resource-role-permission.dto';

@Controller('resource-role-permissions')
export class ResourceRolePermissionsController {
  constructor(private readonly resourceRolePermissionsService: ResourceRolePermissionsService) {}

  @Post()
  create(@Body() createResourceRolePermissionDto: CreateResourceRolePermissionDto) {
    return this.resourceRolePermissionsService.create(createResourceRolePermissionDto);
  }

  @Get()
  findAll() {
    return this.resourceRolePermissionsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.resourceRolePermissionsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateResourceRolePermissionDto: UpdateResourceRolePermissionDto) {
    return this.resourceRolePermissionsService.update(+id, updateResourceRolePermissionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.resourceRolePermissionsService.remove(+id);
  }
}
