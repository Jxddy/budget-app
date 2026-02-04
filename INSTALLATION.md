# 📋 Guide d'Installation et Configuration

## ✅ Fichiers de Configuration Créés

### Racine du Projet
- ✅ `package.json` - Configuration workspace
- ✅ `.prettierrc` - Configuration Prettier
- ✅ `.gitignore` - Fichiers à ignorer
- ✅ `README.md` - Documentation principale

### Backend
- ✅ `backend/package.json` - Dépendances backend
- ✅ `backend/tsconfig.json` - Configuration TypeScript
- ✅ `backend/.env.example` - Variables d'environnement exemple
- ✅ `backend/.eslintrc.js` - Configuration ESLint
- ✅ `backend/jest.config.js` - Configuration tests
- ✅ `backend/prisma/schema.prisma` - Schéma base de données
- ✅ `backend/prisma/seed.ts` - Script de seeding

### Frontend
- ✅ `frontend/package.json` - Dépendances frontend
- ✅ `frontend/tsconfig.json` - Configuration TypeScript
- ✅ `frontend/tsconfig.node.json` - Configuration TypeScript pour Vite
- ✅ `frontend/.env.example` - Variables d'environnement exemple
- ✅ `frontend/.eslintrc.cjs` - Configuration ESLint
- ✅ `frontend/vite.config.ts` - Configuration Vite
- ✅ `frontend/vitest.config.ts` - Configuration tests
- ✅ `frontend/tailwind.config.js` - Configuration Tailwind CSS
- ✅ `frontend/postcss.config.js` - Configuration PostCSS

### Shared
- ✅ `shared/package.json` - Dépendances shared
- ✅ `shared/tsconfig.json` - Configuration TypeScript
- ✅ `shared/src/types/index.ts` - Types partagés
- ✅ `shared/src/schemas/index.ts` - Schémas Zod partagés
- ✅ `shared/src/index.ts` - Point d'entrée

## 🚀 Instructions d'Installation

### 1. Prérequis

Assurez-vous d'avoir installé :
- Node.js >= 18.0.0
- npm >= 9.0.0
- PostgreSQL >= 14

### 2. Installation des Dépendances

```bash
# Depuis la racine du projet
npm install
```

Cette commande installera toutes les dépendances pour :
- Le workspace racine
- Le backend
- Le frontend
- Le module shared

### 3. Configuration Backend

```bash
cd backend
cp .env.example .env
```

Éditez le fichier `.env` et configurez :

```env
DATABASE_URL="postgresql://username:password@localhost:5432/budget_app_dev"
JWT_SECRET="votre-secret-jwt-super-securise"
PORT=5000
```

### 4. Configuration Frontend

```bash
cd ../frontend
cp .env.example .env
```

Le fichier `.env` par défaut devrait fonctionner :

```env
VITE_API_URL=http://localhost:5000/api/v1
```

### 5. Configuration PostgreSQL

Créez la base de données :

```bash
# Connexion à PostgreSQL
psql -U postgres

# Créer la base de données
CREATE DATABASE budget_app_dev;

# Créer un utilisateur (optionnel)
CREATE USER budget_user WITH PASSWORD 'votre_mot_de_passe';
GRANT ALL PRIVILEGES ON DATABASE budget_app_dev TO budget_user;

\q
```

### 6. Initialiser Prisma

```bash
cd backend

# Générer le client Prisma
npm run prisma:generate

# Créer les migrations
npm run prisma:migrate

# Seed des données de test (optionnel)
npm run prisma:seed
```

### 7. Lancer l'Application

#### Option A : Tout lancer en même temps (recommandé)

Depuis la racine :
```bash
npm run dev
```

#### Option B : Lancer séparément

Terminal 1 - Backend :
```bash
npm run dev:backend
```

Terminal 2 - Frontend :
```bash
npm run dev:frontend
```

### 8. Accès à l'Application

- **Frontend** : http://localhost:5173
- **Backend API** : http://localhost:5000
- **Prisma Studio** : http://localhost:5555 (avec `npm run prisma:studio`)

### 9. Compte de Test

Si vous avez exécuté le seed :

```
Email : demo@budgetapp.com
Mot de passe : Password123!
```

## 📊 Structure de la Base de Données

Le schéma Prisma inclut 11 modèles principaux :

1. **User** - Utilisateurs
2. **Budget** - Budgets mensuels
3. **SubBudget** - Sous-budgets catégorisés
4. **Transaction** - Transactions financières
5. **Category** - Catégories personnalisées
6. **RecurringTransaction** - Transactions récurrentes
7. **Alert** - Système d'alertes
8. **SavingsGoal** - Objectifs d'épargne
9. **UserSettings** - Paramètres utilisateur
10. **AuditLog** - Journal d'audit

### Relations Principales

```
User
├── Budgets (1:N)
│   └── SubBudgets (1:N)
│       └── Transactions (1:N)
├── Transactions (1:N)
├── Alerts (1:N)
├── Categories (1:N)
└── SavingsGoals (1:N)
```

## 🔧 Commandes Utiles

### Backend

```bash
# Développement
npm run dev

# Build production
npm run build

# Démarrer en production
npm run start

# Tests
npm run test

# Prisma Studio (GUI)
npm run prisma:studio

# Créer une migration
npm run prisma:migrate

# Reset database
npx prisma migrate reset
```

### Frontend

```bash
# Développement
npm run dev

# Build production
npm run build

# Preview build
npm run preview

# Tests
npm run test

# Tests avec UI
npm run test:ui

# Lint
npm run lint
```

### Global

```bash
# Lint tout le projet
npm run lint

# Format tout le projet
npm run format

# Build tout
npm run build

# Tests partout
npm run test
```

## 🐛 Dépannage

### Erreur : "Cannot connect to database"

1. Vérifiez que PostgreSQL est démarré
2. Vérifiez la DATABASE_URL dans `.env`
3. Vérifiez que la base de données existe

### Erreur : "Prisma Client not generated"

```bash
cd backend
npm run prisma:generate
```

### Erreur : Port déjà utilisé

Changez les ports dans :
- Backend : `backend/.env` → `PORT=5001`
- Frontend : `frontend/vite.config.ts` → `port: 5174`

### Problèmes de dépendances

```bash
# Nettoyer et réinstaller
rm -rf node_modules package-lock.json
rm -rf backend/node_modules backend/package-lock.json
rm -rf frontend/node_modules frontend/package-lock.json
rm -rf shared/node_modules shared/package-lock.json

npm install
```

## 📝 Prochaines Étapes

1. ✅ Configuration complète
2. ⏭️ Développer les contrôleurs backend
3. ⏭️ Créer les services backend
4. ⏭️ Implémenter les routes API
5. ⏭️ Développer les composants React
6. ⏭️ Configurer Redux store
7. ⏭️ Implémenter l'authentification
8. ⏭️ Créer les graphiques
9. ⏭️ Tests unitaires et E2E
10. ⏭️ Déploiement

## 📚 Ressources

- [Documentation Prisma](https://www.prisma.io/docs)
- [React Documentation](https://react.dev)
- [Express.js Guide](https://expressjs.com)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)
- [Zod Documentation](https://zod.dev)

---

🎉 **Configuration terminée avec succès !**

Vous avez maintenant une base solide pour développer votre application de gestion de budget.
