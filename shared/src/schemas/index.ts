/**
 * Schémas de validation Zod partagés
 */

import { z } from 'zod';

// ============================================
// SCHÉMAS D'AUTHENTIFICATION
// ============================================

export const registerSchema = z.object({
  email: z.string().email('Email invalide'),
  password: z
    .string()
    .min(8, 'Le mot de passe doit contenir au moins 8 caractères')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Le mot de passe doit contenir au moins une majuscule, une minuscule et un chiffre'
    ),
  firstName: z.string().min(2).max(50).optional(),
  lastName: z.string().min(2).max(50).optional(),
});

export const loginSchema = z.object({
  email: z.string().email('Email invalide'),
  password: z.string().min(1, 'Le mot de passe est requis'),
});

// ============================================
// SCHÉMAS BUDGET
// ============================================

export const createBudgetSchema = z.object({
  name: z.string().min(3, 'Le nom doit contenir au moins 3 caractères').max(100),
  description: z.string().max(500).optional(),
  month: z.number().int().min(1).max(12),
  year: z.number().int().min(2000).max(2100),
  totalAmount: z.number().positive('Le montant doit être positif'),
});

export const updateBudgetSchema = z.object({
  name: z.string().min(3).max(100).optional(),
  description: z.string().max(500).optional(),
  totalAmount: z.number().positive().optional(),
  isActive: z.boolean().optional(),
});

// ============================================
// SCHÉMAS SOUS-BUDGET
// ============================================

export const createSubBudgetSchema = z.object({
  budgetId: z.string().cuid(),
  name: z.string().min(2, 'Le nom doit contenir au moins 2 caractères').max(100),
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
  targetAmount: z.number().positive('Le montant cible doit être positif'),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Couleur hexadécimale invalide').optional(),
  icon: z.string().max(10).optional(),
  alertThreshold: z.number().int().min(0).max(100).optional(),
});

export const updateSubBudgetSchema = z.object({
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

// ============================================
// SCHÉMAS TRANSACTION
// ============================================

export const createTransactionSchema = z.object({
  subBudgetId: z.string().cuid().optional(),
  categoryId: z.string().cuid().optional(),
  type: z.enum(['INCOME', 'EXPENSE']),
  amount: z.number().positive('Le montant doit être positif'),
  description: z.string().min(1, 'La description est requise').max(200),
  notes: z.string().max(1000).optional(),
  date: z.string().datetime().optional(),
  tags: z.array(z.string()).optional(),
  location: z.string().max(200).optional(),
  merchant: z.string().max(100).optional(),
});

export const updateTransactionSchema = z.object({
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

// ============================================
// SCHÉMAS CATÉGORIE
// ============================================

export const createCategorySchema = z.object({
  name: z.string().min(2).max(50),
  description: z.string().max(200).optional(),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
  icon: z.string().max(10),
});

// ============================================
// SCHÉMAS OBJECTIF D'ÉPARGNE
// ============================================

export const createSavingsGoalSchema = z.object({
  name: z.string().min(2).max(100),
  description: z.string().max(500).optional(),
  targetAmount: z.number().positive(),
  targetDate: z.string().datetime().optional(),
  icon: z.string().max(10).optional(),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional(),
  priority: z.number().int().min(0).max(10).optional(),
});

// ============================================
// SCHÉMAS DE REQUÊTE
// ============================================

export const paginationSchema = z.object({
  page: z.number().int().positive().optional().default(1),
  pageSize: z.number().int().positive().max(100).optional().default(20),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
});

export const transactionFiltersSchema = z.object({
  type: z.enum(['INCOME', 'EXPENSE']).optional(),
  subBudgetId: z.string().cuid().optional(),
  categoryId: z.string().cuid().optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  minAmount: z.number().optional(),
  maxAmount: z.number().optional(),
  search: z.string().max(100).optional(),
});

// ============================================
// TYPES EXPORTÉS
// ============================================

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type CreateBudgetInput = z.infer<typeof createBudgetSchema>;
export type UpdateBudgetInput = z.infer<typeof updateBudgetSchema>;
export type CreateSubBudgetInput = z.infer<typeof createSubBudgetSchema>;
export type UpdateSubBudgetInput = z.infer<typeof updateSubBudgetSchema>;
export type CreateTransactionInput = z.infer<typeof createTransactionSchema>;
export type UpdateTransactionInput = z.infer<typeof updateTransactionSchema>;
export type CreateCategoryInput = z.infer<typeof createCategorySchema>;
export type CreateSavingsGoalInput = z.infer<typeof createSavingsGoalSchema>;
export type PaginationInput = z.infer<typeof paginationSchema>;
export type TransactionFiltersInput = z.infer<typeof transactionFiltersSchema>;
