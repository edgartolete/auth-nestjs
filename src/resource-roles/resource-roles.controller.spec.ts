import { Test, TestingModule } from '@nestjs/testing';
import { ResourceRolesController } from './resource-roles.controller';
import { ResourceRolesService } from './resource-roles.service';

describe('ResourceRolesController', () => {
  let controller: ResourceRolesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ResourceRolesController],
      providers: [ResourceRolesService],
    }).compile();

    controller = module.get<ResourceRolesController>(ResourceRolesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
