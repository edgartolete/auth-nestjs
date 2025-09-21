import { Test, TestingModule } from '@nestjs/testing';
import { ResourceRolePermissionsController } from './resource-role-permissions.controller';
import { ResourceRolePermissionsService } from './resource-role-permissions.service';

describe('ResourceRolePermissionsController', () => {
  let controller: ResourceRolePermissionsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ResourceRolePermissionsController],
      providers: [ResourceRolePermissionsService],
    }).compile();

    controller = module.get<ResourceRolePermissionsController>(ResourceRolePermissionsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
