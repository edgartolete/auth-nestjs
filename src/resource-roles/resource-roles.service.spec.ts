import { Test, TestingModule } from '@nestjs/testing';
import { ResourceRolesService } from './resource-roles.service';

describe('ResourceRolesService', () => {
  let service: ResourceRolesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ResourceRolesService],
    }).compile();

    service = module.get<ResourceRolesService>(ResourceRolesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
