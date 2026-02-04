import prisma from '../config/database';
import { NotFoundError, BadRequestError, ForbiddenError } from '../utils/errors';
import { SubBudgetCategory } from '@prisma/client';
import { calculatePercentage } from '../utils/helpers';

interface CreateSubBudgetData {
  budgetId: string;
  name: string;
  description?: string;
  category: SubBudgetCategory;
  targetAmount: number;
  color?: string;
  icon?: string;
  alertThreshold?: number;
}

interface UpdateSubBudgetData {
  name?: string;
  description?: string;
  category?: SubBudgetCategory;
  targetAmount?: number;
  color?: string;
  icon?: string;
  alertThreshold?: number;
  alertEnabled?: boolean;
  order?: number;
}

export class SubBudgetService {
  /**
   * Créer un sous-budget
   */
  async createSubBudget(data: CreateSubBudgetData, userId: string) {
    const { budgetId, ...subBudgetData } = data;

    // Vérifier que le budget existe et appartient à l'utilisateur
    const budget = await prisma.budget.findFirst({
      where: { id: budgetId, userId },
    });

    if (!budget) {
      throw new NotFoundError('Budget non trouvé');
    }

    // Obtenir l'ordre suivant
    const lastSubBudget = await prisma.subBudget.findFirst({
      where: { budgetId },
      orderBy: { order: 'desc' },
    });

    const order = lastSubBudget ? lastSubBudget.order + 1 : 0;

    // Créer le sous-budget
    const subBudget = await prisma.subBudget.create({
      data: {
        ...subBudgetData,
        budgetId,
        order,
      },
    });

    return subBudget;
  }

  /**
   * Obtenir tous les sous-budgets d'un budget
   */
  async getSubBudgets(budgetId: string, userId: string) {
    // Vérifier que le budget appartient à l'utilisateur
    const budget = await prisma.budget.findFirst({
      where: { id: budgetId, userId },
    });

    if (!budget) {
      throw new NotFoundError('Budget non trouvé');
    }

    const subBudgets = await prisma.subBudget.findMany({
      where: { budgetId, isActive: true },
      include: {
        _count: {
          select: { transactions: true },
        },
      },
      orderBy: { order: 'asc' },
    });

    // Enrichir avec les pourcentages
    return subBudgets.map((sb) => ({
      ...sb,
      percentageUsed: calculatePercentage(Number(sb.currentAmount), Number(sb.targetAmount)),
      transactionCount: sb._count.transactions,
    }));
  }

  /**
   * Obtenir un sous-budget par ID
   */
  async getSubBudgetById(subBudgetId: string, userId: string) {
    const subBudget = await prisma.subBudget.findUnique({
      where: { id: subBudgetId },
      include: {
        budget: {
          select: {
            userId: true,
          },
        },
        transactions: {
          orderBy: { date: 'desc' },
          take: 20,
        },
        _count: {
          select: { transactions: true },
        },
      },
    });

    if (!subBudget) {
      throw new NotFoundError('Sous-budget non trouvé');
    }

    // Vérifier que l'utilisateur a accès
    if (subBudget.budget.userId !== userId) {
      throw new ForbiddenError('Accès non autorisé');
    }

    return {
      ...subBudget,
      percentageUsed: calculatePercentage(
        Number(subBudget.currentAmount),
        Number(subBudget.targetAmount)
      ),
      transactionCount: subBudget._count.transactions,
    };
  }

  /**
   * Mettre à jour un sous-budget
   */
  async updateSubBudget(subBudgetId: string, userId: string, data: UpdateSubBudgetData) {
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

    const updated = await prisma.subBudget.update({
      where: { id: subBudgetId },
      data,
    });

    return updated;
  }

  /**
   * Supprimer un sous-budget
   */
  async deleteSubBudget(subBudgetId: string, userId: string) {
    const subBudget = await prisma.subBudget.findUnique({
      where: { id: subBudgetId },
      include: {
        budget: {
          select: { userId: true },
        },
        _count: {
          select: { transactions: true },
        },
      },
    });

    if (!subBudget) {
      throw new NotFoundError('Sous-budget non trouvé');
    }

    if (subBudget.budget.userId !== userId) {
      throw new ForbiddenError('Accès non autorisé');
    }

    // Vérifier s'il y a des transactions
    if (subBudget._count.transactions > 0) {
      throw new BadRequestError(
        'Impossible de supprimer un sous-budget avec des transactions. Désactivez-le plutôt.'
      );
    }

    await prisma.subBudget.delete({
      where: { id: subBudgetId },
    });

    return { message: 'Sous-budget supprimé avec succès' };
  }

  /**
   * Désactiver un sous-budget
   */
  async deactivateSubBudget(subBudgetId: string, userId: string) {
    return this.updateSubBudget(subBudgetId, userId, { isActive: false });
  }

  /**
   * Réorganiser les sous-budgets
   */
  async reorderSubBudgets(budgetId: string, userId: string, orderedIds: string[]) {
    // Vérifier que le budget appartient à l'utilisateur
    const budget = await prisma.budget.findFirst({
      where: { id: budgetId, userId },
    });

    if (!budget) {
      throw new NotFoundError('Budget non trouvé');
    }

    // Mettre à jour l'ordre de chaque sous-budget
    const updates = orderedIds.map((id, index) =>
      prisma.subBudget.update({
        where: { id },
        data: { order: index },
      })
    );

    await prisma.$transaction(updates);

    return { message: 'Ordre mis à jour avec succès' };
  }

  /**
   * Obtenir les statistiques d'un sous-budget
   */
  async getSubBudgetStats(subBudgetId: string, userId: string) {
    const subBudget = await this.getSubBudgetById(subBudgetId, userId);

    // Calculer les statistiques des transactions
    const transactions = await prisma.transaction.findMany({
      where: { subBudgetId },
    });

    const totalIncome = transactions
      .filter((t) => t.type === 'INCOME')
      .reduce((sum, t) => sum + Number(t.amount), 0);

    const totalExpense = transactions
      .filter((t) => t.type === 'EXPENSE')
      .reduce((sum, t) => sum + Number(t.amount), 0);

    const averageTransaction =
      transactions.length > 0
        ? transactions.reduce((sum, t) => sum + Number(t.amount), 0) / transactions.length
        : 0;

    return {
      subBudget,
      stats: {
        totalIncome,
        totalExpense,
        averageTransaction,
        transactionCount: transactions.length,
        remaining: Number(subBudget.targetAmount) - Number(subBudget.currentAmount),
      },
    };
  }

  /**
   * Vérifier et créer des alertes pour un sous-budget
   */
  async checkAndCreateAlerts(subBudgetId: string) {
    const subBudget = await prisma.subBudget.findUnique({
      where: { id: subBudgetId },
      include: {
        budget: {
          select: { userId: true },
        },
      },
    });

    if (!subBudget || !subBudget.alertEnabled) {
      return;
    }

    const percentage = calculatePercentage(
      Number(subBudget.currentAmount),
      Number(subBudget.targetAmount)
    );

    // Alerte de seuil atteint
    if (percentage >= subBudget.alertThreshold && percentage < 100) {
      await prisma.alert.create({
        data: {
          userId: subBudget.budget.userId,
          type: 'BUDGET_LIMIT',
          priority: 'MEDIUM',
          title: 'Limite de budget approchée',
          message: `⚠️ Le sous-budget "${subBudget.name}" a atteint ${percentage.toFixed(0)}% de son objectif`,
          metadata: {
            subBudgetId: subBudget.id,
            percentage,
          },
        },
      });
    }

    // Alerte de dépassement
    if (percentage >= 100) {
      await prisma.alert.create({
        data: {
          userId: subBudget.budget.userId,
          type: 'OVERSPENDING',
          priority: 'HIGH',
          title: 'Budget dépassé',
          message: `🚨 Le sous-budget "${subBudget.name}" a dépassé son objectif (${percentage.toFixed(0)}%)`,
          metadata: {
            subBudgetId: subBudget.id,
            percentage,
          },
        },
      });
    }
  }
}

export default new SubBudgetService();
