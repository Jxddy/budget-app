import { Router } from 'express';
import budgetController from '../controllers/budget.controller';
import { authenticate } from '../middleware/auth';
import { validateBody } from '../middleware/validation';
import { z } from 'zod';

const router = Router();

// Schémas de validation
const createBudgetSchema = z.object({
  name: z.string().min(3).max(100),
  description: z.string().max(500).optional(),
  month: z.number().int().min(1).max(12),
  year: z.number().int().min(2000).max(2100),
  totalAmount: z.number().positive(),
});

const updateBudgetSchema = z.object({
  name: z.string().min(3).max(100).optional(),
  description: z.string().max(500).optional(),
  totalAmount: z.number().positive().optional(),
  isActive: z.boolean().optional(),
});

const duplicateBudgetSchema = z.object({
  month: z.number().int().min(1).max(12),
  year: z.number().int().min(2000).max(2100),
});

// Toutes les routes nécessitent une authentification
router.use(authenticate);

// Routes
router.post('/', validateBody(createBudgetSchema), budgetController.createBudget);
router.get('/', budgetController.getBudgets);
router.get('/active', budgetController.getActiveBudget);
router.get('/:id', budgetController.getBudgetById);
router.get('/:id/summary', budgetController.getBudgetSummary);
router.patch('/:id', validateBody(updateBudgetSchema), budgetController.updateBudget);
router.post('/:id/archive', budgetController.archiveBudget);
router.post('/:id/duplicate', validateBody(duplicateBudgetSchema), budgetController.duplicateBudget);
router.delete('/:id', budgetController.deleteBudget);

export default router;
