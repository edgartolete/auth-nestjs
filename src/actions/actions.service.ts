import {
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { actions } from 'src/db/schema/actions.schema';
import { and, eq, like } from 'drizzle-orm';
import { db } from 'src/db';
import {
  CreateActionDto,
  DeleteActionDto,
  UpdateActionDto,
} from './actions.dto';
import { QueryFilterDto } from 'src/common/dto/filter.dto';
import { SQL } from 'drizzle-orm';
import { getPagination, paginateFilter } from 'src/common/utils/request.util';

@Injectable()
export class ActionsService {
  async create(createAction: CreateActionDto) {
    return await db
      .insert(actions)
      .values(createAction)
      .$returningId()
      .then((result) => ({ success: true, message: 'Added', result }))
      .catch((error) => {
        throw new NotAcceptableException(`${error.message}`);
      });
  }
  async findAll(query: QueryFilterDto) {
    const { keyword, pageNum, pageSize, isActive } = query;

    const conditions: (SQL<unknown> | undefined)[] = [];

    if (keyword) {
      conditions.push(like(actions.code, `%${keyword}%`));
    }

    if (isActive) {
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

    return {
      success: true,
      message,
      data: result,
      pagination: getPagination(totalItems, pageNum, pageSize),
    };
  }

  async findOne(id: number, isActive: boolean) {
    const conditions: (SQL<unknown> | undefined)[] = [];

    if (isActive) {
      conditions.push(eq(actions.isActive, true));
    }

    conditions.push(eq(actions.id, id));

    const result = await db.query.actions.findFirst({
      where: and(...conditions),
    });

    if (!result) {
      throw new NotFoundException('Action Not found');
    }

    return {
      success: true,
      message: 'Action fetched successfully',
      data: result,
    };
  }

  async update(id: number, updateAction: UpdateActionDto) {
    return await db
      .update(actions)
      .set(updateAction)
      .where(eq(actions.id, id))
      .then((result) => ({ success: true, message: 'Updated', result }))
      .catch((error) => {
        throw new NotAcceptableException(`${error.message}`);
      });
  }

  async remove(id: number, deleteAction: DeleteActionDto) {
    const whereClause = eq(actions.id, id);

    if (!deleteAction.hard) {
      await db
        .update(actions)
        .set({ isActive: false })
        .where(whereClause)
        .then((result) => ({ success: true, message: `Soft deleted`, result }))
        .catch((error) => {
          throw new NotAcceptableException(`${error.message}`);
        });
    }

    await db
      .delete(actions)
      .where(whereClause)
      .then((result) => ({ success: true, message: 'Hard deleted', result }))
      .catch((error) => {
        throw new NotAcceptableException(`${error.message}`);
      });
  }
}
