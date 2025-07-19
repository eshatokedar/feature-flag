import { Request, Response } from 'express';
import prisma from '../prisma/client';

export const createFlag = async (req: Request, res: Response) => {
  try {
    const { name, enabled, rolloutPercentage } = req.body;

    const flag = await prisma.featureFlag.create({
      data: {
        name,
        enabled,
        rolloutPercentage,
      },
    });

    res.status(201).json(flag);
  } catch (error) {
    res.status(400).json({ error: 'Feature flag already exists or bad input' });
  }
};

export const toggleFlag = async (req: Request, res: Response) => {
  const id  = Number(req.params.id);
  const { enabled } = req.body;

  try {
    const updatedFlag = await prisma.featureFlag.update({
      where: { id },
      data: { enabled },
    });
    res.status(200).json(updatedFlag);
  } catch (error) {
    res.status(500).json({ error: 'Failed to toggle feature flag' });
  }
};

export const deleteFlag = async (req: Request, res: Response) => {
  const id  = Number(req.params.id);

  try {
    await prisma.featureFlag.delete({
      where: { id },
    });
    res.status(200).json({ message: 'Feature flag deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete feature flag' });
  }
};


export const evaluateFlag = async (req: Request, res: Response) => {
  const { name } = req.params;
  const { userId, env } = req.query;

  if (!userId || typeof userId !== 'string') {
    return res.status(400).json({ error: 'Missing or invalid userId' });
  }

  const flag = await prisma.featureFlag.findUnique({ where: { name } });

  if (!flag || !flag.enabled) {
    return res.json({ active: false });
  }

  // Future: check env-based rules here

  // Use rollout logic
  const { rolloutPercentage } = flag;
  const { isUserInRollout } = await import('../services/rollout.service');

  const active = isUserInRollout(userId, rolloutPercentage);
  return res.json({ active });
};


export const getAllFlags = async (_req: Request, res: Response) => {
  const flags = await prisma.featureFlag.findMany();
  res.status(200).json(flags);
};
