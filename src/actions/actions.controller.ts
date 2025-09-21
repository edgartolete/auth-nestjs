import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
} from '@nestjs/common';
import { ActionsService } from './actions.service';
import {
  CreateActionDto,
  UpdateActionDto,
  DeleteActionDto,
} from './actions.dto';
import { getFilters, paginateFilter } from 'src/common/utils/request.util';
import { FastifyRequest } from 'fastify';
import { and, like, SQL } from 'drizzle-orm';
import { actions } from 'src/db/schema/actions.schema';
import { eq } from 'drizzle-orm';
import { db } from 'src/db';

@Controller('actions')
export class ActionsController {
  constructor(private readonly actionsService: ActionsService) {}

  @Post()
  create(@Body() createActionDto: CreateActionDto) {
    return this.actionsService.create(createActionDto);
  }

  @Get()
  async findAll(@Req() req: FastifyRequest) {
    const { keyword, pageNum, pageSize, activeOnly } = getFilters(req);

    const conditions: (SQL<unknown> | undefined)[] = [];

    if (keyword) {
      conditions.push(like(actions.code, `%${keyword}%`));
    }

    if (activeOnly) {
      conditions.push(eq(actions.isActive, true));
    }

    const result = await db.query.actions.findMany({
      where: and(...conditions),
      extras: {
        total: db.$count(actions).as('total'),
      },
      ...paginateFilter(pageSize, pageNum),
    });

    const totalItems =
      result && result.length > 0 ? (result[0] as any).total : 0;

    const message = result.length
      ? 'Actions fetched successfully'
      : 'No roles found';

    res.status(200).json({
      success: true,
      message,
      data: result,
      pagination: getPagination(totalItems, pageNum, pageSize),
    });

    return this.actionsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.actionsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateActionDto: UpdateActionDto) {
    return this.actionsService.update(+id, updateActionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Body() deleteActionDto: DeleteActionDto) {
    return this.actionsService.remove(+id);
  }
}
