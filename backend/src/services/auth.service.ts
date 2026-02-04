import bcrypt from 'bcrypt';
import prisma from '../config/database';
import { generateTokens } from '../utils/jwt';
import { ConflictError, UnauthorizedError, NotFoundError } from '../utils/errors';
import config from '../config';

interface RegisterData {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

interface LoginData {
  email: string;
  password: string;
}

export class AuthService {
  /**
   * Inscription d'un nouvel utilisateur
   */
  async register(data: RegisterData) {
    const { email, password, firstName, lastName } = data;

    // Vérifier si l'email existe déjà
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictError('Cet email est déjà utilisé');
    }

    // Hacher le mot de passe
    const passwordHash = await bcrypt.hash(password, config.BCRYPT_ROUNDS);

    // Créer l'utilisateur
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        firstName,
        lastName,
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        currency: true,
        darkMode: true,
        createdAt: true,
      },
    });

    // Générer les tokens
    const tokens = generateTokens({
      userId: user.id,
      email: user.email,
    });

    return {
      user,
      ...tokens,
    };
  }

  /**
   * Connexion d'un utilisateur
   */
  async login(data: LoginData) {
    const { email, password } = data;

    // Trouver l'utilisateur
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new UnauthorizedError('Email ou mot de passe incorrect');
    }

    // Vérifier le statut du compte
    if (!user.isActive) {
      throw new UnauthorizedError('Compte désactivé');
    }

    // Vérifier le mot de passe
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

    if (!isPasswordValid) {
      throw new UnauthorizedError('Email ou mot de passe incorrect');
    }

    // Mettre à jour la dernière connexion
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    // Générer les tokens
    const tokens = generateTokens({
      userId: user.id,
      email: user.email,
    });

    // Retourner l'utilisateur sans le mot de passe
    const { passwordHash, ...userWithoutPassword } = user;

    return {
      user: userWithoutPassword,
      ...tokens,
    };
  }

  /**
   * Récupérer le profil de l'utilisateur connecté
   */
  async getProfile(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        avatarUrl: true,
        currency: true,
        locale: true,
        darkMode: true,
        emailNotifications: true,
        alertNotifications: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw new NotFoundError('Utilisateur non trouvé');
    }

    return user;
  }

  /**
   * Mettre à jour le profil
   */
  async updateProfile(
    userId: string,
    data: {
      firstName?: string;
      lastName?: string;
      currency?: string;
      locale?: string;
      darkMode?: boolean;
    }
  ) {
    const user = await prisma.user.update({
      where: { id: userId },
      data,
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        currency: true,
        locale: true,
        darkMode: true,
        updatedAt: true,
      },
    });

    return user;
  }

  /**
   * Changer le mot de passe
   */
  async changePassword(userId: string, oldPassword: string, newPassword: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundError('Utilisateur non trouvé');
    }

    // Vérifier l'ancien mot de passe
    const isOldPasswordValid = await bcrypt.compare(oldPassword, user.passwordHash);

    if (!isOldPasswordValid) {
      throw new UnauthorizedError('Mot de passe actuel incorrect');
    }

    // Hacher le nouveau mot de passe
    const newPasswordHash = await bcrypt.hash(newPassword, config.BCRYPT_ROUNDS);

    // Mettre à jour
    await prisma.user.update({
      where: { id: userId },
      data: { passwordHash: newPasswordHash },
    });

    return { message: 'Mot de passe modifié avec succès' };
  }
}

export default new AuthService();
