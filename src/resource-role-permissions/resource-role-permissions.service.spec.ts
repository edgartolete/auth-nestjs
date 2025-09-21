import { Test, TestingModule } from '@nestjs/testing';
import { ResourceRolePermissionsService } from './resource-role-permissions.service';

describe('ResourceRolePermissionsService', () => {
  let service: ResourceRolePermissionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ResourceRolePermissionsService],
    }).compile();

    service = module.get<ResourceRolePermissionsService>(ResourceRolePermissionsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
