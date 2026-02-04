/**
 * Formate un montant en devise
 */
export const formatCurrency = (amount: number, currency = 'EUR', locale = 'fr-FR'): string => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  }).format(amount);
};

/**
 * Calcule le pourcentage
 */
export const calculatePercentage = (current: number, total: number): number => {
  if (total === 0) return 0;
  return (current / total) * 100;
};

/**
 * Arrondit un nombre à 2 décimales
 */
export const roundToTwo = (num: number): number => {
  return Math.round((num + Number.EPSILON) * 100) / 100;
};

/**
 * Vérifie si une date est dans le passé
 */
export const isPastDate = (date: Date): boolean => {
  return date < new Date();
};

/**
 * Vérifie si une date est dans le futur
 */
export const isFutureDate = (date: Date): boolean => {
  return date > new Date();
};

/**
 * Obtient le premier jour du mois
 */
export const getFirstDayOfMonth = (year: number, month: number): Date => {
  return new Date(year, month - 1, 1);
};

/**
 * Obtient le dernier jour du mois
 */
export const getLastDayOfMonth = (year: number, month: number): Date => {
  return new Date(year, month, 0);
};

/**
 * Génère un slug à partir d'une chaîne
 */
export const slugify = (text: string): string => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-');
};

/**
 * Pagination helper
 */
export const getPaginationParams = (page = 1, pageSize = 20) => {
  const skip = (page - 1) * pageSize;
  const take = pageSize;

  return { skip, take };
};

/**
 * Génère une réponse paginée
 */
export const createPaginatedResponse = <T>(
  data: T[],
  total: number,
  page: number,
  pageSize: number
) => {
  return {
    data,
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  };
};
