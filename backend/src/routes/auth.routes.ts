import { Router } from 'express';
import authController from '../controllers/auth.controller';
import { authenticate } from '../middleware/auth';
import { validateBody } from '../middleware/validation';
import { z } from 'zod';

const router = Router();

// Schémas de validation
const registerSchema = z.object({
  body: z.object({
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
  }),
});

const loginSchema = z.object({
  body: z.object({
    email: z.string().email('Email invalide'),
    password: z.string().min(1, 'Le mot de passe est requis'),
  }),
});

const updateProfileSchema = z.object({
  body: z.object({
    firstName: z.string().min(2).max(50).optional(),
    lastName: z.string().min(2).max(50).optional(),
    currency: z.string().length(3).optional(),
    locale: z.string().optional(),
    darkMode: z.boolean().optional(),
  }),
});

const changePasswordSchema = z.object({
  body: z.object({
    oldPassword: z.string().min(1),
    newPassword: z
      .string()
      .min(8)
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/),
  }),
});

// Routes publiques
router.post('/register', validateBody(registerSchema.shape.body), authController.register);
router.post('/login', validateBody(loginSchema.shape.body), authController.login);

// Routes protégées
router.get('/profile', authenticate, authController.getProfile);
router.patch('/profile', authenticate, validateBody(updateProfileSchema.shape.body), authController.updateProfile);
router.post('/change-password', authenticate, validateBody(changePasswordSchema.shape.body), authController.changePassword);

export default router;
