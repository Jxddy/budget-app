import { Request, Response, NextFunction } from 'express';
import transactionService from '../services/transaction.service';

export class TransactionController {
  /**
   * Créer une transaction
   * POST /api/v1/transactions
   */
  async createTransaction(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const transaction = await transactionService.createTransaction(req.body, userId);

      res.status(201).json({
        success: true,
        message: 'Transaction créée avec succès',
        data: transaction,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Obtenir les transactions avec filtres et pagination
   * GET /api/v1/transactions
   */
  async getTransactions(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const { page, pageSize, type, subBudgetId, categoryId, search, startDate, endDate, minAmount, maxAmount } = req.query;

      const filters = {
        type: type as any,
        subBudgetId: subBudgetId as string,
        categoryId: categoryId as string,
        search: search as string,
        startDate: startDate ? new Date(startDate as string) : undefined,
        endDate: endDate ? new Date(endDate as string) : undefined,
        minAmount: minAmount ? Number(minAmount) : undefined,
        maxAmount: maxAmount ? Number(maxAmount) : undefined,
      };

      const result = await transactionService.getTransactions(
        userId,
        filters,
        page ? Number(page) : 1,
        pageSize ? Number(pageSize) : 20
      );

      res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Obtenir une transaction par ID
   * GET /api/v1/transactions/:id
   */
  async getTransactionById(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const { id } = req.params;

      const transaction = await transactionService.getTransactionById(id, userId);

      res.json({
        success: true,
        data: transaction,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Mettre à jour une transaction
   * PATCH /api/v1/transactions/:id
   */
  async updateTransaction(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const { id } = req.params;

      const transaction = await transactionService.updateTransaction(id, userId, req.body);

      res.json({
        success: true,
        message: 'Transaction mise à jour',
        data: transaction,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Supprimer une transaction
   * DELETE /api/v1/transactions/:id
   */
  async deleteTransaction(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const { id } = req.params;

      const result = await transactionService.deleteTransaction(id, userId);

      res.json({
        success: true,
        message: result.message,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Obtenir les statistiques des transactions
   * GET /api/v1/transactions/stats
   */
  async getTransactionStats(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const { startDate, endDate } = req.query;

      const stats = await transactionService.getTransactionStats(
        userId,
        startDate ? new Date(startDate as string) : undefined,
        endDate ? new Date(endDate as string) : undefined
      );

      res.json({
        success: true,
        data: stats,
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new TransactionController();
