import { PartialType } from '@nestjs/mapped-types';
import { CreateResourceRoleDto } from './create-resource-role.dto';

export class UpdateResourceRoleDto extends PartialType(CreateResourceRoleDto) {}
