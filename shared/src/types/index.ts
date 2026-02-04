/**
 * Types partagés entre le frontend et le backend
 */

// ============================================
// ENUMS
// ============================================

export enum TransactionType {
  INCOME = 'INCOME',
  EXPENSE = 'EXPENSE',
}

export enum TransactionStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export enum SubBudgetCategory {
  SAVINGS = 'SAVINGS',
  INVESTMENT = 'INVESTMENT',
  DAILY_EXPENSES = 'DAILY_EXPENSES',
  BILLS = 'BILLS',
  RENT = 'RENT',
  ENTERTAINMENT = 'ENTERTAINMENT',
  TRANSPORTATION = 'TRANSPORTATION',
  FOOD = 'FOOD',
  HEALTH = 'HEALTH',
  EDUCATION = 'EDUCATION',
  SHOPPING = 'SHOPPING',
  TRAVEL = 'TRAVEL',
  SPORT = 'SPORT',
  GIFTS = 'GIFTS',
  PETS = 'PETS',
  OTHER = 'OTHER',
}

export enum AlertType {
  BUDGET_LIMIT = 'BUDGET_LIMIT',
  GOAL_REACHED = 'GOAL_REACHED',
  LOW_BALANCE = 'LOW_BALANCE',
  OVERSPENDING = 'OVERSPENDING',
  RECURRING_DUE = 'RECURRING_DUE',
  MONTHLY_SUMMARY = 'MONTHLY_SUMMARY',
  CUSTOM = 'CUSTOM',
}

export enum AlertPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  URGENT = 'URGENT',
}

export enum RecurringFrequency {
  DAILY = 'DAILY',
  WEEKLY = 'WEEKLY',
  BIWEEKLY = 'BIWEEKLY',
  MONTHLY = 'MONTHLY',
  QUARTERLY = 'QUARTERLY',
  YEARLY = 'YEARLY',
}

export enum GoalStatus {
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  PAUSED = 'PAUSED',
}

// ============================================
// INTERFACES DE BASE
// ============================================

export interface IUser {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  avatarUrl?: string;
  currency: string;
  locale: string;
  darkMode: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IBudget {
  id: string;
  userId: string;
  name: string;
  description?: string;
  month: number;
  year: number;
  totalAmount: number;
  isActive: boolean;
  isArchived: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ISubBudget {
  id: string;
  budgetId: string;
  name: string;
  description?: string;
  category: SubBudgetCategory;
  targetAmount: number;
  currentAmount: number;
  color: string;
  icon: string;
  alertThreshold: number;
  alertEnabled: boolean;
  order: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ITransaction {
  id: string;
  userId: string;
  subBudgetId?: string;
  categoryId?: string;
  type: TransactionType;
  status: TransactionStatus;
  amount: number;
  description: string;
  notes?: string;
  date: Date;
  transactionDate: Date;
  tags: string[];
  location?: string;
  merchant?: string;
  attachmentUrl?: string;
  receiptUrl?: string;
  isRecurring: boolean;
  recurringId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IAlert {
  id: string;
  userId: string;
  type: AlertType;
  priority: AlertPriority;
  title: string;
  message: string;
  metadata?: Record<string, any>;
  actionUrl?: string;
  isRead: boolean;
  isDismissed: boolean;
  readAt?: Date;
  createdAt: Date;
  expiresAt?: Date;
}

export interface ICategory {
  id: string;
  userId: string;
  name: string;
  description?: string;
  color: string;
  icon: string;
  isDefault: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ISavingsGoal {
  id: string;
  userId: string;
  subBudgetId?: string;
  name: string;
  description?: string;
  targetAmount: number;
  currentAmount: number;
  icon: string;
  color: string;
  imageUrl?: string;
  startDate: Date;
  targetDate?: Date;
  completedAt?: Date;
  status: GoalStatus;
  priority: number;
  createdAt: Date;
  updatedAt: Date;
}

// ============================================
// DTOs (Data Transfer Objects)
// ============================================

export interface CreateUserDTO {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

export interface LoginDTO {
  email: string;
  password: string;
}

export interface CreateBudgetDTO {
  name: string;
  description?: string;
  month: number;
  year: number;
  totalAmount: number;
}

export interface UpdateBudgetDTO {
  name?: string;
  description?: string;
  totalAmount?: number;
  isActive?: boolean;
}

export interface CreateSubBudgetDTO {
  budgetId: string;
  name: string;
  description?: string;
  category: SubBudgetCategory;
  targetAmount: number;
  color?: string;
  icon?: string;
  alertThreshold?: number;
}

export interface UpdateSubBudgetDTO {
  name?: string;
  description?: string;
  category?: SubBudgetCategory;
  targetAmount?: number;
  color?: string;
  icon?: string;
  alertThreshold?: number;
  alertEnabled?: boolean;
}

export interface CreateTransactionDTO {
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

export interface UpdateTransactionDTO {
  subBudgetId?: string;
  categoryId?: string;
  type?: TransactionType;
  status?: TransactionStatus;
  amount?: number;
  description?: string;
  notes?: string;
  date?: Date;
  tags?: string[];
}

// ============================================
// RÉPONSES API
// ============================================

export interface AuthResponse {
  user: IUser;
  token: string;
  refreshToken: string;
}

export interface BudgetSummaryResponse {
  budget: IBudget;
  totalSpent: number;
  totalTarget: number;
  remaining: number;
  percentageUsed: number;
  subBudgets: Array<
    ISubBudget & {
      percentageUsed: number;
      transactionCount: number;
    }
  >;
}

export interface DashboardResponse {
  currentBudget: BudgetSummaryResponse;
  recentTransactions: ITransaction[];
  alerts: IAlert[];
  savingsGoals: ISavingsGoal[];
  monthlyComparison: {
    currentMonth: number;
    previousMonth: number;
    change: number;
    changePercentage: number;
  };
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// ============================================
// FILTRES ET REQUÊTES
// ============================================

export interface TransactionFilters {
  type?: TransactionType;
  subBudgetId?: string;
  categoryId?: string;
  startDate?: Date;
  endDate?: Date;
  minAmount?: number;
  maxAmount?: number;
  search?: string;
}

export interface PaginationParams {
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}
