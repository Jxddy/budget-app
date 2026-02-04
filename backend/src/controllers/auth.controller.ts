import { Request, Response, NextFunction } from 'express';
import authService from '../services/auth.service';

export class AuthController {
  /**
   * Inscription
   * POST /api/v1/auth/register
   */
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await authService.register(req.body);

      res.status(201).json({
        success: true,
        message: 'Inscription réussie',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Connexion
   * POST /api/v1/auth/login
   */
  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await authService.login(req.body);

      res.json({
        success: true,
        message: 'Connexion réussie',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Récupérer le profil de l'utilisateur connecté
   * GET /api/v1/auth/profile
   */
  async getProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const user = await authService.getProfile(userId);

      res.json({
        success: true,
        data: user,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Mettre à jour le profil
   * PATCH /api/v1/auth/profile
   */
  async updateProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const user = await authService.updateProfile(userId, req.body);

      res.json({
        success: true,
        message: 'Profil mis à jour',
        data: user,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Changer le mot de passe
   * POST /api/v1/auth/change-password
   */
  async changePassword(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const { oldPassword, newPassword } = req.body;

      const result = await authService.changePassword(userId, oldPassword, newPassword);

      res.json({
        success: true,
        message: result.message,
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new AuthController();
