import { Test, TestingModule } from '@nestjs/testing';
import { GroupRolesService } from './group-roles.service';

describe('GroupRolesService', () => {
  let service: GroupRolesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GroupRolesService],
    }).compile();

    service = module.get<GroupRolesService>(GroupRolesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
