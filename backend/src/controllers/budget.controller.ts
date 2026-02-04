import { Request, Response, NextFunction } from 'express';
import budgetService from '../services/budget.service';

export class BudgetController {
  /**
   * Créer un budget
   * POST /api/v1/budgets
   */
  async createBudget(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const budget = await budgetService.createBudget({
        ...req.body,
        userId,
      });

      res.status(201).json({
        success: true,
        message: 'Budget créé avec succès',
        data: budget,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Obtenir tous les budgets
   * GET /api/v1/budgets
   */
  async getBudgets(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const includeArchived = req.query.includeArchived === 'true';

      const budgets = await budgetService.getBudgets(userId, includeArchived);

      res.json({
        success: true,
        data: budgets,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Obtenir un budget par ID
   * GET /api/v1/budgets/:id
   */
  async getBudgetById(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const { id } = req.params;

      const budget = await budgetService.getBudgetById(id, userId);

      res.json({
        success: true,
        data: budget,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Obtenir le résumé d'un budget
   * GET /api/v1/budgets/:id/summary
   */
  async getBudgetSummary(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const { id } = req.params;

      const summary = await budgetService.getBudgetSummary(id, userId);

      res.json({
        success: true,
        data: summary,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Obtenir le budget actif
   * GET /api/v1/budgets/active
   */
  async getActiveBudget(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const budget = await budgetService.getActiveBudget(userId);

      res.json({
        success: true,
        data: budget,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Mettre à jour un budget
   * PATCH /api/v1/budgets/:id
   */
  async updateBudget(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const { id } = req.params;

      const budget = await budgetService.updateBudget(id, userId, req.body);

      res.json({
        success: true,
        message: 'Budget mis à jour',
        data: budget,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Archiver un budget
   * POST /api/v1/budgets/:id/archive
   */
  async archiveBudget(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const { id } = req.params;

      const budget = await budgetService.archiveBudget(id, userId);

      res.json({
        success: true,
        message: 'Budget archivé',
        data: budget,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Supprimer un budget
   * DELETE /api/v1/budgets/:id
   */
  async deleteBudget(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const { id } = req.params;

      const result = await budgetService.deleteBudget(id, userId);

      res.json({
        success: true,
        message: result.message,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Dupliquer un budget
   * POST /api/v1/budgets/:id/duplicate
   */
  async duplicateBudget(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const { id } = req.params;
      const { month, year } = req.body;

      const budget = await budgetService.duplicateBudget(id, userId, month, year);

      res.status(201).json({
        success: true,
        message: 'Budget dupliqué avec succès',
        data: budget,
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new BudgetController();
