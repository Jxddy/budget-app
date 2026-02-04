import { Router } from 'express';
import transactionController from '../controllers/transaction.controller';
import { authenticate } from '../middleware/auth';
import { validateBody } from '../middleware/validation';
import { z } from 'zod';

const router = Router();

// Schémas de validation
const createTransactionSchema = z.object({
  subBudgetId: z.string().cuid().optional(),
  categoryId: z.string().cuid().optional(),
  type: z.enum(['INCOME', 'EXPENSE']),
  amount: z.number().positive(),
  description: z.string().min(1).max(200),
  notes: z.string().max(1000).optional(),
  date: z.string().datetime().optional(),
  tags: z.array(z.string()).optional(),
  location: z.string().max(200).optional(),
  merchant: z.string().max(100).optional(),
});

const updateTransactionSchema = z.object({
  subBudgetId: z.string().cuid().optional(),
  categoryId: z.string().cuid().optional(),
  type: z.enum(['INCOME', 'EXPENSE']).optional(),
  status: z.enum(['PENDING', 'COMPLETED', 'CANCELLED']).optional(),
  amount: z.number().positive().optional(),
  description: z.string().min(1).max(200).optional(),
  notes: z.string().max(1000).optional(),
  date: z.string().datetime().optional(),
  tags: z.array(z.string()).optional(),
  location: z.string().max(200).optional(),
  merchant: z.string().max(100).optional(),
});

// Toutes les routes nécessitent une authentification
router.use(authenticate);

// Routes
router.post('/', validateBody(createTransactionSchema), transactionController.createTransaction);
router.get('/', transactionController.getTransactions);
router.get('/stats', transactionController.getTransactionStats);
router.get('/:id', transactionController.getTransactionById);
router.patch('/:id', validateBody(updateTransactionSchema), transactionController.updateTransaction);
router.delete('/:id', transactionController.deleteTransaction);

export default router;
