import { PartialType } from '@nestjs/mapped-types';
import { CreateResourceRolePermissionDto } from './create-resource-role-permission.dto';

export class UpdateResourceRolePermissionDto extends PartialType(CreateResourceRolePermissionDto) {}
