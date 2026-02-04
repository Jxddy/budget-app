import jwt from 'jsonwebtoken';
import config from '../config';

export interface TokenPayload {
  userId: string;
  email: string;
}

/**
 * Génère un token JWT d'accès
 */
export const generateAccessToken = (payload: TokenPayload): string => {
  return jwt.sign(payload, config.JWT_SECRET, {
    expiresIn: config.JWT_EXPIRES_IN,
  });
};

/**
 * Génère un token JWT de rafraîchissement
 */
export const generateRefreshToken = (payload: TokenPayload): string => {
  return jwt.sign(payload, config.JWT_REFRESH_SECRET, {
    expiresIn: config.JWT_REFRESH_EXPIRES_IN,
  });
};

/**
 * Vérifie et décode un token d'accès
 */
export const verifyAccessToken = (token: string): TokenPayload => {
  try {
    return jwt.verify(token, config.JWT_SECRET) as TokenPayload;
  } catch (error) {
    throw new Error('Token invalide ou expiré');
  }
};

/**
 * Vérifie et décode un token de rafraîchissement
 */
export const verifyRefreshToken = (token: string): TokenPayload => {
  try {
    return jwt.verify(token, config.JWT_REFRESH_SECRET) as TokenPayload;
  } catch (error) {
    throw new Error('Token de rafraîchissement invalide ou expiré');
  }
};

/**
 * Génère les deux tokens (accès + rafraîchissement)
 */
export const generateTokens = (payload: TokenPayload) => {
  return {
    accessToken: generateAccessToken(payload),
    refreshToken: generateRefreshToken(payload),
  };
};
