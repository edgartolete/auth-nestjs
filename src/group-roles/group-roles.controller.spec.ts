import { Test, TestingModule } from '@nestjs/testing';
import { GroupRolesController } from './group-roles.controller';
import { GroupRolesService } from './group-roles.service';

describe('GroupRolesController', () => {
  let controller: GroupRolesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GroupRolesController],
      providers: [GroupRolesService],
    }).compile();

    controller = module.get<GroupRolesController>(GroupRolesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
