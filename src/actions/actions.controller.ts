import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseIntPipe,
  ParseBoolPipe,
} from '@nestjs/common';
import { ActionsService } from './actions.service';
import {
  CreateActionDto,
  UpdateActionDto,
  DeleteActionDto,
} from './actions.dto';
import { QueryFilterDto } from 'src/common/dto/filter.dto';

@Controller('actions')
export class ActionsController {
  constructor(private readonly actionsService: ActionsService) {}

  @Post()
  async create(@Body() createActionDto: CreateActionDto) {
    return await this.actionsService.create(createActionDto);
  }

  @Get()
  async findAll(@Query() query: QueryFilterDto) {
    return await this.actionsService.findAll(query);
  }

  @Get(':id')
  async findOne(
    @Param('id', ParseIntPipe) id: number,
    @Query('isActive', ParseBoolPipe) isActive: boolean,
  ) {
    return await this.actionsService.findOne(+id, isActive);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: string,
    @Body() updateActionDto: UpdateActionDto,
  ) {
    return await this.actionsService.update(+id, updateActionDto);
  }

  @Delete(':id')
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @Body() deleteActionDto: DeleteActionDto,
  ) {
    return await this.actionsService.remove(id, deleteActionDto);
  }
}
