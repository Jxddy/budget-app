/**
 * Classe d'erreur personnalisée pour l'API
 */
export class ApiError extends Error {
  public statusCode: number;
  public isOperational: boolean;
  public errors?: any[];

  constructor(statusCode: number, message: string, isOperational = true, errors?: any[]) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.errors = errors;

    // Maintenir une stack trace appropriée
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Erreurs HTTP courantes
 */
export class BadRequestError extends ApiError {
  constructor(message = 'Requête invalide', errors?: any[]) {
    super(400, message, true, errors);
  }
}

export class UnauthorizedError extends ApiError {
  constructor(message = 'Non autorisé') {
    super(401, message);
  }
}

export class ForbiddenError extends ApiError {
  constructor(message = 'Accès interdit') {
    super(403, message);
  }
}

export class NotFoundError extends ApiError {
  constructor(message = 'Ressource non trouvée') {
    super(404, message);
  }
}

export class ConflictError extends ApiError {
  constructor(message = 'Conflit de données') {
    super(409, message);
  }
}

export class ValidationError extends ApiError {
  constructor(message = 'Erreur de validation', errors?: any[]) {
    super(422, message, true, errors);
  }
}

export class InternalServerError extends ApiError {
  constructor(message = 'Erreur interne du serveur') {
    super(500, message, false);
  }
}
