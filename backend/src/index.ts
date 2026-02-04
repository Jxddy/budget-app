import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';

import config from './config';
import { connectDatabase } from './config/database';
import routes from './routes';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';

// Créer l'application Express
const app: Application = express();

// ============================================
// CONFIGURATION DES MIDDLEWARES
// ============================================

// Sécurité avec Helmet
app.use(helmet());

// CORS
app.use(
  cors({
    origin: config.ALLOWED_ORIGINS,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Compression des réponses
app.use(compression());

// Parser JSON
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Parser des cookies
app.use(cookieParser());

// Logging des requêtes
if (config.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Rate limiting
const limiter = rateLimit({
  windowMs: config.RATE_LIMIT_WINDOW_MS,
  max: config.RATE_LIMIT_MAX_REQUESTS,
  message: {
    success: false,
    message: 'Trop de requêtes, veuillez réessayer plus tard.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(limiter);

// ============================================
// ROUTES
// ============================================

// Route de base
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'API Budget Manager',
    version: config.API_VERSION,
    documentation: `/api/${config.API_VERSION}/health`,
  });
});

// Routes de l'API
app.use(`/api/${config.API_VERSION}`, routes);

// ============================================
// GESTION DES ERREURS
// ============================================

// Route non trouvée
app.use(notFoundHandler);

// Gestionnaire d'erreurs global
app.use(errorHandler);

// ============================================
// DÉMARRAGE DU SERVEUR
// ============================================

const startServer = async () => {
  try {
    // Connexion à la base de données
    await connectDatabase();

    // Démarrage du serveur
    app.listen(config.PORT, () => {
      console.log('');
      console.log('🚀 ================================');
      console.log(`🚀 Serveur démarré avec succès`);
      console.log(`🚀 Environnement: ${config.NODE_ENV}`);
      console.log(`🚀 Port: ${config.PORT}`);
      console.log(`🚀 URL: http://localhost:${config.PORT}`);
      console.log(`🚀 API: http://localhost:${config.PORT}/api/${config.API_VERSION}`);
      console.log('🚀 ================================');
      console.log('');
    });
  } catch (error) {
    console.error('❌ Erreur au démarrage du serveur:', error);
    process.exit(1);
  }
};

// Démarrer le serveur
startServer();

// Gestion des erreurs non capturées
process.on('unhandledRejection', (reason: any) => {
  console.error('❌ Unhandled Rejection:', reason);
  process.exit(1);
});

process.on('uncaughtException', (error: Error) => {
  console.error('❌ Uncaught Exception:', error);
  process.exit(1);
});

export default app;
