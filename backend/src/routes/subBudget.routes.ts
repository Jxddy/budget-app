import { Router } from 'express';
import subBudgetController from '../controllers/subBudget.controller';
import { authenticate } from '../middleware/auth';
import { validateBody } from '../middleware/validation';
import { z } from 'zod';

const router = Router();

// Schémas de validation
const createSubBudgetSchema = z.object({
  budgetId: z.string().cuid(),
  name: z.string().min(2).max(100),
  description: z.string().max(500).optional(),
  category: z.enum([
    'SAVINGS',
    'INVESTMENT',
    'DAILY_EXPENSES',
    'BILLS',
    'RENT',
    'ENTERTAINMENT',
    'TRANSPORTATION',
    'FOOD',
    'HEALTH',
    'EDUCATION',
    'SHOPPING',
    'TRAVEL',
    'SPORT',
    'GIFTS',
    'PETS',
    'OTHER',
  ]),
  targetAmount: z.number().positive(),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional(),
  icon: z.string().max(10).optional(),
  alertThreshold: z.number().int().min(0).max(100).optional(),
});

const updateSubBudgetSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  description: z.string().max(500).optional(),
  category: z
    .enum([
      'SAVINGS',
      'INVESTMENT',
      'DAILY_EXPENSES',
      'BILLS',
      'RENT',
      'ENTERTAINMENT',
      'TRANSPORTATION',
      'FOOD',
      'HEALTH',
      'EDUCATION',
      'SHOPPING',
      'TRAVEL',
      'SPORT',
      'GIFTS',
      'PETS',
      'OTHER',
    ])
    .optional(),
  targetAmount: z.number().positive().optional(),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional(),
  icon: z.string().max(10).optional(),
  alertThreshold: z.number().int().min(0).max(100).optional(),
  alertEnabled: z.boolean().optional(),
});

const reorderSchema = z.object({
  orderedIds: z.array(z.string().cuid()),
});

// Toutes les routes nécessitent une authentification
router.use(authenticate);

// Routes
router.post('/', validateBody(createSubBudgetSchema), subBudgetController.createSubBudget);
router.get('/:id', subBudgetController.getSubBudgetById);
router.get('/:id/stats', subBudgetController.getSubBudgetStats);
router.patch('/:id', validateBody(updateSubBudgetSchema), subBudgetController.updateSubBudget);
router.delete('/:id', subBudgetController.deleteSubBudget);
router.post('/:id/deactivate', subBudgetController.deactivateSubBudget);

export default router;
