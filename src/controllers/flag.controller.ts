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
        // description: description || '',
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

export const bulkUpdateFlags = async (req: Request, res: Response) => {
  try {
    const { flags } = req.body;
    
    if (!Array.isArray(flags)) {
      return res.status(400).json({ error: 'Flags must be an array' });
    }

    // Update each flag
    const updatePromises = flags.map((flag: any) => 
      prisma.featureFlag.upsert({
        where: { name: flag.name },
        update: { 
          enabled: flag.enabled,
          // description: flag.description || ''
        },
        create: {
          name: flag.name,
          enabled: flag.enabled,
          // description: flag.description || '',
          rolloutPercentage: 0
        }
      })
    );

    const updatedFlags = await Promise.all(updatePromises);
    res.status(200).json(updatedFlags);
  } catch (error) {
    console.error('Bulk update error:', error);
    res.status(500).json({ error: 'Failed to update feature flags' });
  }
};

export const initializeDefaultFlags = async (_req: Request, res: Response) => {
  try {
    const defaultFlags = [
      {
        name: 'showWelcomeCard',
        enabled: true,
        description: 'Controls the visibility of the main welcome card with star icon'
      },
      {
        name: 'showStatsCard',
        enabled: false,
        description: 'Shows/hides the statistics dashboard with user metrics'
      },
      {
        name: 'showPromoBanner',
        enabled: true,
        description: 'Displays the promotional banner with special offers'
      },
      {
        name: 'enableDarkMode',
        enabled: false,
        description: 'Switches the entire application to dark theme'
      },
      {
        name: 'showNotifications',
        enabled: true,
        description: 'Shows notification bell icon in the header'
      },
      {
        name: 'showUserProfile',
        enabled: false,
        description: 'Displays user profile information in header'
      },
      {
        name: 'enableNewButton',
        enabled: true,
        description: 'Shows the gradient "New Feature Button" with sparkles'
      },
      {
        name: 'showFooter',
        enabled: true,
        description: 'Controls footer visibility at bottom of page'
      },
      {
        name: 'showSidebar',
        enabled: false,
        description: 'Shows/hides the navigation sidebar'
      },
      {
        name: 'enableAnimations',
        enabled: true,
        description: 'Enables hover animations and transitions'
      }
    ];

    const createPromises = defaultFlags.map(flag => 
      prisma.featureFlag.upsert({
        where: { name: flag.name },
        update: {},
        create: {
          name: flag.name,
          enabled: flag.enabled,
          // description: flag.description,
          rolloutPercentage: 0
        }
      })
    );

    const flags = await Promise.all(createPromises);
    res.status(200).json(flags);
  } catch (error) {
    console.error('Initialize default flags error:', error);
    res.status(500).json({ error: 'Failed to initialize default flags' });
  }
};
