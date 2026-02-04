import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/errors';
import config from '../config';

/**
 * Middleware de gestion globale des erreurs
 */
export const errorHandler = (
  err: Error | ApiError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Log de l'erreur
  console.error('❌ Erreur:', {
    message: err.message,
    stack: config.NODE_ENV === 'development' ? err.stack : undefined,
    path: req.path,
    method: req.method,
  });

  // Erreur API personnalisée
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      errors: err.errors,
      ...(config.NODE_ENV === 'development' && { stack: err.stack }),
    });
  }

  // Erreurs Prisma
  if (err.name === 'PrismaClientKnownRequestError') {
    const prismaError = err as any;

    // Violation de contrainte unique
    if (prismaError.code === 'P2002') {
      return res.status(409).json({
        success: false,
        message: 'Cette ressource existe déjà',
        field: prismaError.meta?.target?.[0],
      });
    }

    // Enregistrement non trouvé
    if (prismaError.code === 'P2025') {
      return res.status(404).json({
        success: false,
        message: 'Ressource non trouvée',
      });
    }
  }

  // Erreurs de validation Zod
  if (err.name === 'ZodError') {
    const zodError = err as any;
    return res.status(400).json({
      success: false,
      message: 'Erreur de validation',
      errors: zodError.errors,
    });
  }

  // Erreurs JWT
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      message: 'Token invalide',
    });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      message: 'Token expiré',
    });
  }

  // Erreur générique
  return res.status(500).json({
    success: false,
    message: config.NODE_ENV === 'production' 
      ? 'Une erreur interne est survenue' 
      : err.message,
    ...(config.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

/**
 * Middleware pour les routes non trouvées
 */
export const notFoundHandler = (req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.path} non trouvée`,
  });
};
