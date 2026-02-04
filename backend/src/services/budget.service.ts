import prisma from '../config/database';
import { NotFoundError, BadRequestError, ForbiddenError } from '../utils/errors';
import { calculatePercentage } from '../utils/helpers';

interface CreateBudgetData {
  userId: string;
  name: string;
  description?: string;
  month: number;
  year: number;
  totalAmount: number;
}

interface UpdateBudgetData {
  name?: string;
  description?: string;
  totalAmount?: number;
  isActive?: boolean;
}

export class BudgetService {
  /**
   * Créer un nouveau budget
   */
  async createBudget(data: CreateBudgetData) {
    const { userId, month, year } = data;

    // Vérifier qu'un budget n'existe pas déjà pour ce mois
    const existingBudget = await prisma.budget.findUnique({
      where: {
        userId_month_year: { userId, month, year },
      },
    });

    if (existingBudget) {
      throw new BadRequestError('Un budget existe déjà pour ce mois');
    }

    // Désactiver les autres budgets actifs
    await prisma.budget.updateMany({
      where: {
        userId,
        isActive: true,
      },
      data: {
        isActive: false,
      },
    });

    // Créer le budget
    const budget = await prisma.budget.create({
      data: {
        ...data,
        isActive: true,
      },
      include: {
        subBudgets: true,
      },
    });

    return budget;
  }

  /**
   * Obtenir tous les budgets d'un utilisateur
   */
  async getBudgets(userId: string, includeArchived = false) {
    const budgets = await prisma.budget.findMany({
      where: {
        userId,
        ...(includeArchived ? {} : { isArchived: false }),
      },
      include: {
        subBudgets: {
          select: {
            id: true,
            name: true,
            category: true,
            targetAmount: true,
            currentAmount: true,
            color: true,
            icon: true,
          },
        },
      },
      orderBy: [{ year: 'desc' }, { month: 'desc' }],
    });

    return budgets;
  }

  /**
   * Obtenir un budget par ID avec ses détails
   */
  async getBudgetById(budgetId: string, userId: string) {
    const budget = await prisma.budget.findFirst({
      where: {
        id: budgetId,
        userId,
      },
      include: {
        subBudgets: {
          include: {
            _count: {
              select: { transactions: true },
            },
          },
          orderBy: { order: 'asc' },
        },
      },
    });

    if (!budget) {
      throw new NotFoundError('Budget non trouvé');
    }

    return budget;
  }

  /**
   * Obtenir le résumé complet d'un budget
   */
  async getBudgetSummary(budgetId: string, userId: string) {
    const budget = await this.getBudgetById(budgetId, userId);

    // Calculer les totaux
    const totalSpent = budget.subBudgets.reduce(
      (sum, sb) => sum + Number(sb.currentAmount),
      0
    );

    const totalTarget = budget.subBudgets.reduce(
      (sum, sb) => sum + Number(sb.targetAmount),
      0
    );

    const remaining = Number(budget.totalAmount) - totalSpent;
    const percentageUsed = calculatePercentage(totalSpent, Number(budget.totalAmount));

    // Enrichir les sous-budgets avec les pourcentages
    const enrichedSubBudgets = budget.subBudgets.map((sb) => ({
      ...sb,
      percentageUsed: calculatePercentage(Number(sb.currentAmount), Number(sb.targetAmount)),
      transactionCount: sb._count.transactions,
    }));

    return {
      budget: {
        id: budget.id,
        name: budget.name,
        description: budget.description,
        month: budget.month,
        year: budget.year,
        totalAmount: budget.totalAmount,
        isActive: budget.isActive,
        createdAt: budget.createdAt,
        updatedAt: budget.updatedAt,
      },
      totalSpent,
      totalTarget,
      remaining,
      percentageUsed,
      subBudgets: enrichedSubBudgets,
    };
  }

  /**
   * Obtenir le budget actif
   */
  async getActiveBudget(userId: string) {
    const budget = await prisma.budget.findFirst({
      where: {
        userId,
        isActive: true,
      },
      include: {
        subBudgets: {
          include: {
            _count: {
              select: { transactions: true },
            },
          },
          orderBy: { order: 'asc' },
        },
      },
    });

    if (!budget) {
      return null;
    }

    return this.getBudgetSummary(budget.id, userId);
  }

  /**
   * Mettre à jour un budget
   */
  async updateBudget(budgetId: string, userId: string, data: UpdateBudgetData) {
    // Vérifier que le budget appartient à l'utilisateur
    const existingBudget = await prisma.budget.findFirst({
      where: { id: budgetId, userId },
    });

    if (!existingBudget) {
      throw new NotFoundError('Budget non trouvé');
    }

    // Si on active ce budget, désactiver les autres
    if (data.isActive === true) {
      await prisma.budget.updateMany({
        where: {
          userId,
          id: { not: budgetId },
          isActive: true,
        },
        data: { isActive: false },
      });
    }

    // Mettre à jour
    const budget = await prisma.budget.update({
      where: { id: budgetId },
      data,
      include: {
        subBudgets: true,
      },
    });

    return budget;
  }

  /**
   * Archiver un budget
   */
  async archiveBudget(budgetId: string, userId: string) {
    const budget = await prisma.budget.findFirst({
      where: { id: budgetId, userId },
    });

    if (!budget) {
      throw new NotFoundError('Budget non trouvé');
    }

    if (budget.isActive) {
      throw new BadRequestError('Impossible d\'archiver le budget actif');
    }

    const archivedBudget = await prisma.budget.update({
      where: { id: budgetId },
      data: { isArchived: true },
    });

    return archivedBudget;
  }

  /**
   * Supprimer un budget
   */
  async deleteBudget(budgetId: string, userId: string) {
    const budget = await prisma.budget.findFirst({
      where: { id: budgetId, userId },
    });

    if (!budget) {
      throw new NotFoundError('Budget non trouvé');
    }

    if (budget.isActive) {
      throw new BadRequestError('Impossible de supprimer le budget actif');
    }

    await prisma.budget.delete({
      where: { id: budgetId },
    });

    return { message: 'Budget supprimé avec succès' };
  }

  /**
   * Dupliquer un budget pour un nouveau mois
   */
  async duplicateBudget(budgetId: string, userId: string, month: number, year: number) {
    const originalBudget = await prisma.budget.findFirst({
      where: { id: budgetId, userId },
      include: { subBudgets: true },
    });

    if (!originalBudget) {
      throw new NotFoundError('Budget non trouvé');
    }

    // Vérifier qu'un budget n'existe pas déjà
    const existingBudget = await prisma.budget.findUnique({
      where: {
        userId_month_year: { userId, month, year },
      },
    });

    if (existingBudget) {
      throw new BadRequestError('Un budget existe déjà pour ce mois');
    }

    // Créer le nouveau budget
    const newBudget = await prisma.budget.create({
      data: {
        userId,
        name: `Budget ${month}/${year}`,
        description: originalBudget.description,
        month,
        year,
        totalAmount: originalBudget.totalAmount,
        isActive: false,
        subBudgets: {
          create: originalBudget.subBudgets.map((sb) => ({
            name: sb.name,
            description: sb.description,
            category: sb.category,
            targetAmount: sb.targetAmount,
            currentAmount: 0, // Reset à 0
            color: sb.color,
            icon: sb.icon,
            alertThreshold: sb.alertThreshold,
            alertEnabled: sb.alertEnabled,
            order: sb.order,
          })),
        },
      },
      include: {
        subBudgets: true,
      },
    });

    return newBudget;
  }
}

export default new BudgetService();
