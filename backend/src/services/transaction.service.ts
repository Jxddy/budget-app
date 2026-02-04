import prisma from '../config/database';
import { NotFoundError, BadRequestError, ForbiddenError } from '../utils/errors';
import { TransactionType, TransactionStatus } from '@prisma/client';
import { getPaginationParams, createPaginatedResponse } from '../utils/helpers';
import subBudgetService from './subBudget.service';

interface CreateTransactionData {
  subBudgetId?: string;
  categoryId?: string;
  type: TransactionType;
  amount: number;
  description: string;
  notes?: string;
  date?: Date;
  tags?: string[];
  location?: string;
  merchant?: string;
}

interface UpdateTransactionData {
  subBudgetId?: string;
  categoryId?: string;
  type?: TransactionType;
  status?: TransactionStatus;
  amount?: number;
  description?: string;
  notes?: string;
  date?: Date;
  tags?: string[];
  location?: string;
  merchant?: string;
}

interface TransactionFilters {
  type?: TransactionType;
  subBudgetId?: string;
  categoryId?: string;
  startDate?: Date;
  endDate?: Date;
  minAmount?: number;
  maxAmount?: number;
  search?: string;
}

export class TransactionService {
  /**
   * Créer une nouvelle transaction
   */
  async createTransaction(data: CreateTransactionData, userId: string) {
    const { subBudgetId, ...transactionData } = data;

    // Si un sous-budget est spécifié, vérifier qu'il appartient à l'utilisateur
    if (subBudgetId) {
      const subBudget = await prisma.subBudget.findUnique({
        where: { id: subBudgetId },
        include: {
          budget: {
            select: { userId: true },
          },
        },
      });

      if (!subBudget) {
        throw new NotFoundError('Sous-budget non trouvé');
      }

      if (subBudget.budget.userId !== userId) {
        throw new ForbiddenError('Accès non autorisé');
      }
    }

    // Créer la transaction dans une transaction Prisma
    const transaction = await prisma.$transaction(async (tx) => {
      // Créer la transaction
      const newTransaction = await tx.transaction.create({
        data: {
          ...transactionData,
          userId,
          subBudgetId,
          transactionDate: data.date || new Date(),
        },
        include: {
          subBudget: {
            select: {
              id: true,
              name: true,
              category: true,
            },
          },
          category: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });

      // Mettre à jour le montant du sous-budget si applicable
      if (subBudgetId && newTransaction.status === 'COMPLETED') {
        const subBudget = await tx.subBudget.findUnique({
          where: { id: subBudgetId },
        });

        if (subBudget) {
          const newAmount =
            data.type === 'EXPENSE'
              ? Number(subBudget.currentAmount) + data.amount
              : Number(subBudget.currentAmount) - data.amount;

          await tx.subBudget.update({
            where: { id: subBudgetId },
            data: { currentAmount: Math.max(0, newAmount) },
          });

          // Vérifier les alertes
          await subBudgetService.checkAndCreateAlerts(subBudgetId);
        }
      }

      return newTransaction;
    });

    return transaction;
  }

  /**
   * Obtenir les transactions avec filtres et pagination
   */
  async getTransactions(
    userId: string,
    filters: TransactionFilters = {},
    page = 1,
    pageSize = 20
  ) {
    const { skip, take } = getPaginationParams(page, pageSize);

    // Construire les conditions de filtrage
    const where: any = { userId };

    if (filters.type) {
      where.type = filters.type;
    }

    if (filters.subBudgetId) {
      where.subBudgetId = filters.subBudgetId;
    }

    if (filters.categoryId) {
      where.categoryId = filters.categoryId;
    }

    if (filters.startDate || filters.endDate) {
      where.transactionDate = {};
      if (filters.startDate) {
        where.transactionDate.gte = filters.startDate;
      }
      if (filters.endDate) {
        where.transactionDate.lte = filters.endDate;
      }
    }

    if (filters.minAmount !== undefined || filters.maxAmount !== undefined) {
      where.amount = {};
      if (filters.minAmount !== undefined) {
        where.amount.gte = filters.minAmount;
      }
      if (filters.maxAmount !== undefined) {
        where.amount.lte = filters.maxAmount;
      }
    }

    if (filters.search) {
      where.OR = [
        { description: { contains: filters.search, mode: 'insensitive' } },
        { notes: { contains: filters.search, mode: 'insensitive' } },
        { merchant: { contains: filters.search, mode: 'insensitive' } },
      ];
    }

    // Récupérer les transactions
    const [transactions, total] = await Promise.all([
      prisma.transaction.findMany({
        where,
        include: {
          subBudget: {
            select: {
              id: true,
              name: true,
              category: true,
              color: true,
              icon: true,
            },
          },
          category: {
            select: {
              id: true,
              name: true,
              color: true,
              icon: true,
            },
          },
        },
        orderBy: { transactionDate: 'desc' },
        skip,
        take,
      }),
      prisma.transaction.count({ where }),
    ]);

    return createPaginatedResponse(transactions, total, page, pageSize);
  }

  /**
   * Obtenir une transaction par ID
   */
  async getTransactionById(transactionId: string, userId: string) {
    const transaction = await prisma.transaction.findFirst({
      where: {
        id: transactionId,
        userId,
      },
      include: {
        subBudget: {
          select: {
            id: true,
            name: true,
            category: true,
            color: true,
            icon: true,
          },
        },
        category: {
          select: {
            id: true,
            name: true,
            color: true,
            icon: true,
          },
        },
      },
    });

    if (!transaction) {
      throw new NotFoundError('Transaction non trouvée');
    }

    return transaction;
  }

  /**
   * Mettre à jour une transaction
   */
  async updateTransaction(transactionId: string, userId: string, data: UpdateTransactionData) {
    const existingTransaction = await prisma.transaction.findFirst({
      where: {
        id: transactionId,
        userId,
      },
    });

    if (!existingTransaction) {
      throw new NotFoundError('Transaction non trouvée');
    }

    // Mise à jour dans une transaction Prisma
    const updated = await prisma.$transaction(async (tx) => {
      // Restaurer l'ancien montant du sous-budget si nécessaire
      if (
        existingTransaction.subBudgetId &&
        existingTransaction.status === 'COMPLETED' &&
        (data.amount !== undefined || data.type !== undefined || data.status !== undefined)
      ) {
        const oldSubBudget = await tx.subBudget.findUnique({
          where: { id: existingTransaction.subBudgetId },
        });

        if (oldSubBudget) {
          const restoreAmount =
            existingTransaction.type === 'EXPENSE'
              ? Number(oldSubBudget.currentAmount) - Number(existingTransaction.amount)
              : Number(oldSubBudget.currentAmount) + Number(existingTransaction.amount);

          await tx.subBudget.update({
            where: { id: existingTransaction.subBudgetId },
            data: { currentAmount: Math.max(0, restoreAmount) },
          });
        }
      }

      // Mettre à jour la transaction
      const updatedTransaction = await tx.transaction.update({
        where: { id: transactionId },
        data,
        include: {
          subBudget: {
            select: {
              id: true,
              name: true,
              category: true,
            },
          },
        },
      });

      // Appliquer le nouveau montant au sous-budget
      const newSubBudgetId = data.subBudgetId ?? existingTransaction.subBudgetId;

      if (newSubBudgetId && updatedTransaction.status === 'COMPLETED') {
        const newSubBudget = await tx.subBudget.findUnique({
          where: { id: newSubBudgetId },
        });

        if (newSubBudget) {
          const newAmount =
            updatedTransaction.type === 'EXPENSE'
              ? Number(newSubBudget.currentAmount) + Number(updatedTransaction.amount)
              : Number(newSubBudget.currentAmount) - Number(updatedTransaction.amount);

          await tx.subBudget.update({
            where: { id: newSubBudgetId },
            data: { currentAmount: Math.max(0, newAmount) },
          });

          await subBudgetService.checkAndCreateAlerts(newSubBudgetId);
        }
      }

      return updatedTransaction;
    });

    return updated;
  }

  /**
   * Supprimer une transaction
   */
  async deleteTransaction(transactionId: string, userId: string) {
    const transaction = await prisma.transaction.findFirst({
      where: {
        id: transactionId,
        userId,
      },
    });

    if (!transaction) {
      throw new NotFoundError('Transaction non trouvée');
    }

    // Suppression dans une transaction Prisma
    await prisma.$transaction(async (tx) => {
      // Restaurer le montant du sous-budget
      if (transaction.subBudgetId && transaction.status === 'COMPLETED') {
        const subBudget = await tx.subBudget.findUnique({
          where: { id: transaction.subBudgetId },
        });

        if (subBudget) {
          const newAmount =
            transaction.type === 'EXPENSE'
              ? Number(subBudget.currentAmount) - Number(transaction.amount)
              : Number(subBudget.currentAmount) + Number(transaction.amount);

          await tx.subBudget.update({
            where: { id: transaction.subBudgetId },
            data: { currentAmount: Math.max(0, newAmount) },
          });
        }
      }

      // Supprimer la transaction
      await tx.transaction.delete({
        where: { id: transactionId },
      });
    });

    return { message: 'Transaction supprimée avec succès' };
  }

  /**
   * Obtenir les statistiques des transactions
   */
  async getTransactionStats(userId: string, startDate?: Date, endDate?: Date) {
    const where: any = { userId };

    if (startDate || endDate) {
      where.transactionDate = {};
      if (startDate) {
        where.transactionDate.gte = startDate;
      }
      if (endDate) {
        where.transactionDate.lte = endDate;
      }
    }

    const [totalIncome, totalExpense, transactionCount] = await Promise.all([
      prisma.transaction.aggregate({
        where: { ...where, type: 'INCOME', status: 'COMPLETED' },
        _sum: { amount: true },
      }),
      prisma.transaction.aggregate({
        where: { ...where, type: 'EXPENSE', status: 'COMPLETED' },
        _sum: { amount: true },
      }),
      prisma.transaction.count({ where }),
    ]);

    const balance = Number(totalIncome._sum.amount || 0) - Number(totalExpense._sum.amount || 0);

    return {
      totalIncome: Number(totalIncome._sum.amount || 0),
      totalExpense: Number(totalExpense._sum.amount || 0),
      balance,
      transactionCount,
    };
  }
}

export default new TransactionService();
