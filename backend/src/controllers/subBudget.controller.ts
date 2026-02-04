import { Request, Response, NextFunction } from 'express';
import subBudgetService from '../services/subBudget.service';

export class SubBudgetController {
  /**
   * Créer un sous-budget
   * POST /api/v1/sub-budgets
   */
  async createSubBudget(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const subBudget = await subBudgetService.createSubBudget(req.body, userId);

      res.status(201).json({
        success: true,
        message: 'Sous-budget créé avec succès',
        data: subBudget,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Obtenir les sous-budgets d'un budget
   * GET /api/v1/budgets/:budgetId/sub-budgets
   */
  async getSubBudgets(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const { budgetId } = req.params;

      const subBudgets = await subBudgetService.getSubBudgets(budgetId, userId);

      res.json({
        success: true,
        data: subBudgets,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Obtenir un sous-budget par ID
   * GET /api/v1/sub-budgets/:id
   */
  async getSubBudgetById(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const { id } = req.params;

      const subBudget = await subBudgetService.getSubBudgetById(id, userId);

      res.json({
        success: true,
        data: subBudget,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Mettre à jour un sous-budget
   * PATCH /api/v1/sub-budgets/:id
   */
  async updateSubBudget(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const { id } = req.params;

      const subBudget = await subBudgetService.updateSubBudget(id, userId, req.body);

      res.json({
        success: true,
        message: 'Sous-budget mis à jour',
        data: subBudget,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Supprimer un sous-budget
   * DELETE /api/v1/sub-budgets/:id
   */
  async deleteSubBudget(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const { id } = req.params;

      const result = await subBudgetService.deleteSubBudget(id, userId);

      res.json({
        success: true,
        message: result.message,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Désactiver un sous-budget
   * POST /api/v1/sub-budgets/:id/deactivate
   */
  async deactivateSubBudget(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const { id } = req.params;

      const subBudget = await subBudgetService.deactivateSubBudget(id, userId);

      res.json({
        success: true,
        message: 'Sous-budget désactivé',
        data: subBudget,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Réorganiser les sous-budgets
   * POST /api/v1/budgets/:budgetId/sub-budgets/reorder
   */
  async reorderSubBudgets(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const { budgetId } = req.params;
      const { orderedIds } = req.body;

      const result = await subBudgetService.reorderSubBudgets(budgetId, userId, orderedIds);

      res.json({
        success: true,
        message: result.message,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Obtenir les statistiques d'un sous-budget
   * GET /api/v1/sub-budgets/:id/stats
   */
  async getSubBudgetStats(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const { id } = req.params;

      const stats = await subBudgetService.getSubBudgetStats(id, userId);

      res.json({
        success: true,
        data: stats,
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new SubBudgetController();
