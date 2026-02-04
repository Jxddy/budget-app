# 🔧 Backend API - Budget Manager

API REST complète pour l'application de gestion de budget personnel.

## 🚀 Stack Technique

- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Langage**: TypeScript 5.3
- **Base de données**: PostgreSQL 14+ avec Prisma ORM
- **Authentification**: JWT (JSON Web Tokens)
- **Validation**: Zod
- **Sécurité**: Helmet, bcrypt, rate limiting
- **Tests**: Jest

## 📋 Prérequis

- Node.js >= 18.0.0
- npm >= 9.0.0
- PostgreSQL >= 14

## 🛠️ Installation

### 1. Installer les dépendances

```bash
npm install
```

### 2. Configuration

Copier le fichier `.env.example` vers `.env` :

```bash
cp .env.example .env
```

Modifier les variables d'environnement dans `.env` :

```env
# Base de données
DATABASE_URL="postgresql://username:password@localhost:5432/budget_app_dev"

# JWT
JWT_SECRET="votre-secret-jwt-super-securise"
JWT_REFRESH_SECRET="votre-secret-refresh-super-securise"

# Application
PORT=5000
NODE_ENV=development
```

### 3. Initialiser la base de données

```bash
# Générer le client Prisma
npm run prisma:generate

# Créer et appliquer les migrations
npm run prisma:migrate

# (Optionnel) Seed des données de test
npm run prisma:seed
```

## 🏃 Lancement

### Mode Développement

```bash
npm run dev
```

Le serveur démarre sur `http://localhost:5000`

### Mode Production

```bash
# Build
npm run build

# Démarrer
npm start
```

## 📊 Base de Données

### Prisma Studio

Interface graphique pour visualiser et éditer les données :

```bash
npm run prisma:studio
```

Accessible sur `http://localhost:5555`

### Migrations

```bash
# Créer une nouvelle migration
npm run prisma:migrate

# Appliquer les migrations (production)
npm run prisma:migrate:deploy

# Réinitialiser la base de données
npx prisma migrate reset
```

## 🧪 Tests

```bash
# Lancer tous les tests
npm test

# Tests en mode watch
npm run test:watch

# Tests avec couverture
npm test -- --coverage
```

## 🔍 Linting et Formatting

```bash
# Linter
npm run lint

# Formatter
npm run format
```

## 📁 Structure du Code

```
src/
├── config/              # Configuration (DB, env)
│   ├── database.ts      # Client Prisma
│   └── index.ts         # Variables d'environnement
│
├── controllers/         # Contrôleurs API
│   ├── auth.controller.ts
│   ├── budget.controller.ts
│   ├── subBudget.controller.ts
│   └── transaction.controller.ts
│
├── services/           # Logique métier
│   ├── auth.service.ts
│   ├── budget.service.ts
│   ├── subBudget.service.ts
│   └── transaction.service.ts
│
├── middleware/         # Middlewares Express
│   ├── auth.ts         # Authentification JWT
│   ├── validation.ts   # Validation Zod
│   └── errorHandler.ts # Gestion des erreurs
│
├── routes/             # Routes API
│   ├── auth.routes.ts
│   ├── budget.routes.ts
│   ├── subBudget.routes.ts
│   ├── transaction.routes.ts
│   └── index.ts
│
├── utils/              # Utilitaires
│   ├── errors.ts       # Classes d'erreurs
│   ├── jwt.ts          # Gestion JWT
│   └── helpers.ts      # Fonctions utilitaires
│
└── index.ts            # Point d'entrée
```

## 🔐 Sécurité

### Fonctionnalités Implémentées

- ✅ Authentification JWT
- ✅ Hachage des mots de passe (bcrypt, 12 rounds)
- ✅ Validation des entrées (Zod)
- ✅ Protection CORS
- ✅ Rate limiting (100 req/15min)
- ✅ Headers de sécurité (Helmet)
- ✅ Protection contre les injections SQL (Prisma)

### Bonnes Pratiques

1. **Ne jamais commiter le fichier `.env`**
2. **Utiliser des secrets forts en production**
3. **Activer HTTPS en production**
4. **Configurer le CORS correctement**
5. **Surveiller les logs d'erreurs**

## 📚 Documentation API

Voir [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) pour la documentation complète des endpoints.

### Endpoints Principaux

```
POST   /api/v1/auth/register          # Inscription
POST   /api/v1/auth/login             # Connexion
GET    /api/v1/auth/profile           # Profil utilisateur

GET    /api/v1/budgets                # Liste des budgets
POST   /api/v1/budgets                # Créer un budget
GET    /api/v1/budgets/active         # Budget actif
GET    /api/v1/budgets/:id            # Détail d'un budget
PATCH  /api/v1/budgets/:id            # Modifier un budget
DELETE /api/v1/budgets/:id            # Supprimer un budget

POST   /api/v1/sub-budgets            # Créer un sous-budget
GET    /api/v1/sub-budgets/:id        # Détail d'un sous-budget
PATCH  /api/v1/sub-budgets/:id        # Modifier un sous-budget

GET    /api/v1/transactions           # Liste des transactions
POST   /api/v1/transactions           # Créer une transaction
GET    /api/v1/transactions/stats     # Statistiques
```

## 🐳 Docker (Optionnel)

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npx prisma generate
RUN npm run build

EXPOSE 5000

CMD ["npm", "start"]
```

## 🚀 Déploiement

### Variables d'Environnement (Production)

```env
NODE_ENV=production
PORT=5000
DATABASE_URL="postgresql://..."
JWT_SECRET="..."
JWT_REFRESH_SECRET="..."
CORS_ORIGIN="https://votre-frontend.com"
```

### Commandes de Déploiement

```bash
# Build
npm run build

# Appliquer les migrations
npm run prisma:migrate:deploy

# Démarrer
npm start
```

### Plateformes Recommandées

- **Backend**: Railway, Render, AWS, Heroku
- **Base de données**: Railway, Supabase, AWS RDS
- **Monitoring**: Sentry, LogRocket

## 📊 Schéma de Base de Données

Le schéma Prisma complet est disponible dans `prisma/schema.prisma`

### Modèles Principaux

- **User** - Utilisateurs
- **Budget** - Budgets mensuels
- **SubBudget** - Sous-catégories de budget (16 types)
- **Transaction** - Transactions financières
- **Alert** - Système d'alertes
- **Category** - Catégories personnalisées
- **RecurringTransaction** - Transactions récurrentes
- **SavingsGoal** - Objectifs d'épargne
- **UserSettings** - Paramètres utilisateur
- **AuditLog** - Journal d'audit

## 🤝 Contribution

1. Créer une branche feature
2. Faire vos modifications
3. Écrire/mettre à jour les tests
4. Vérifier le linting
5. Soumettre une PR

## 📝 Scripts Disponibles

```json
{
  "dev": "Lancer en mode développement",
  "build": "Compiler TypeScript",
  "start": "Lancer en production",
  "test": "Lancer les tests",
  "lint": "Vérifier le code",
  "format": "Formatter le code",
  "prisma:generate": "Générer le client Prisma",
  "prisma:migrate": "Créer/appliquer une migration",
  "prisma:studio": "Ouvrir Prisma Studio",
  "prisma:seed": "Seed des données de test"
}
```

## 🐛 Dépannage

### Erreur de connexion à la base de données

```bash
# Vérifier que PostgreSQL est démarré
sudo service postgresql status

# Vérifier la DATABASE_URL dans .env
```

### Erreur "Prisma Client not generated"

```bash
npm run prisma:generate
```

### Port déjà utilisé

Modifier le `PORT` dans `.env`

## 📞 Support

- Documentation: [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)
- Issues: GitHub Issues
- Email: support@budgetapp.com

## 📄 License

MIT
