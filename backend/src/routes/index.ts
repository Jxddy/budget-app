import { Router } from 'express';
import authRoutes from './auth.routes';
import budgetRoutes from './budget.routes';
import subBudgetRoutes from './subBudget.routes';
import transactionRoutes from './transaction.routes';
import subBudgetController from '../controllers/subBudget.controller';
import { authenticate } from '../middleware/auth';

const router = Router();

// Routes d'authentification
router.use('/auth', authRoutes);

// Routes des budgets
router.use('/budgets', budgetRoutes);

// Route spéciale pour les sous-budgets d'un budget
router.get('/budgets/:budgetId/sub-budgets', authenticate, subBudgetController.getSubBudgets);
router.post('/budgets/:budgetId/sub-budgets/reorder', authenticate, subBudgetController.reorderSubBudgets);

// Routes des sous-budgets
router.use('/sub-budgets', subBudgetRoutes);

// Routes des transactions
router.use('/transactions', transactionRoutes);

// Route de santé de l'API
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'API Budget Manager fonctionne correctement',
    timestamp: new Date().toISOString(),
  });
});

export default router;
