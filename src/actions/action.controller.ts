import { Request, Response } from 'express';
import { db } from '../db';
import { and, eq, like, SQL } from 'drizzle-orm';
import { actions } from '../db/schema/actions.schema';
import {
  getFilters,
  getPagination,
  paginateFilter,
} from 'src/common/utils/request.util';

export const actionController = {
  getAllActions: async (req: Request, res: Response) => {
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
  },
  getActionById: async (req: Request, res: Response) => {
    const actionId = Number(req.params.actionId);

    const appId = await extractAppId(req);

    if (!appId) {
      return res.status(400).json({
        success: false,
        message: 'App ID is required to create action',
      });
    }

    const { activeOnly } = getFilters(req);

    const conditions: (SQL<unknown> | undefined)[] = [];

    if (activeOnly) {
      conditions.push(eq(actions.isActive, true));
    }

    conditions.push(eq(actions.appId, appId));

    conditions.push(eq(actions.id, actionId));

    const result = await db.query.actions.findFirst({
      where: and(...conditions),
    });

    if (!result) {
      return res
        .status(400)
        .json({ success: false, message: 'Action not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Action fetched successfully',
      data: result,
    });
  },
  createAction: async (req: Request, res: Response) => {
    const appId = await extractAppId(req);

    if (!appId) {
      return res.status(400).json({
        success: false,
        message: 'App ID is required to create action',
      });
    }

    if (!appId) {
      return res.status(400).json({
        success: false,
        message: 'App ID is required to create action',
      });
    }
    const searchResult = await db.query.actions.findFirst({
      where: and(eq(actions.appId, appId), eq(actions.code, req.body.code)),
    });

    if (searchResult) {
      return res.status(400).json({
        success: false,
        message: 'action with this code already exists',
      });
    }

    const newAction = {
      ...req.body,
      appId,
    };

    const result = await db.insert(actions).values(newAction).$returningId();

    res.status(201).json({
      success: true,
      message: 'Action created successfully',
      data: result,
    });
  },
  updateAction: async (req: Request, res: Response) => {
    const actionId = Number(req.params.actionId);
    const whereClause = eq(actions.id, actionId);

    const searchResult = await db.query.actions.findFirst({
      columns: { id: true },
      where: whereClause,
    });

    if (!searchResult) {
      return res.status(404).json({
        success: false,
        message: 'Action not found with this ID',
      });
    }

    await db.update(actions).set(req.body).where(whereClause);

    return res
      .status(200)
      .json({ success: true, message: `Updated action with ID ${actionId}` });
  },
  deleteAction: async (req: Request, res: Response) => {
    const actionId = Number(req.params.actionId);

    const isHardDelete = req.body?.hard;

    const whereClause = eq(actions.id, actionId);

    if (!searchResult) {
      return res.status(404).json({
        success: false,
        message: 'Action not found with this ID',
      });
    }

    if (!isHardDelete) {
      await db.update(actions).set({ isActive: false }).where(whereClause);
      return res.status(200).json({
        success: true,
        message: `Soft deleted user with ID ${actionId}`,
      });
    }

    await db.delete(actions).where(whereClause);

    return res
      .status(200)
      .json({ success: true, message: `Deleted user with ID ${actionId}` });
  },
};
