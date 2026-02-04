# 📚 GUIDE COMPLET - APPLICATION BUDGET MANAGER

## 🎯 VUE D'ENSEMBLE

**Budget Manager** est une application full-stack moderne de gestion de budget personnel avec :
- ✅ Backend Node.js + Express + Prisma + PostgreSQL
- ✅ Frontend React + TypeScript + Redux + Tailwind CSS
- ✅ Architecture MVC complète
- ✅ Authentification JWT sécurisée
- ✅ Interface responsive avec mode sombre

---

## 📦 STRUCTURE DU PROJET

```
budget-app/
├── backend/                 # API Node.js + Express
│   ├── src/
│   │   ├── config/         # Configuration (DB, env)
│   │   ├── controllers/    # Contrôleurs API
│   │   ├── services/       # Logique métier
│   │   ├── middleware/     # Middleware (auth, validation)
│   │   ├── routes/         # Routes API
│   │   ├── utils/          # Utilitaires
│   │   └── index.ts        # Serveur Express
│   ├── prisma/
│   │   ├── schema.prisma   # Modèle de données
│   │   └── seed.ts         # Données de test
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/               # Application React
│   ├── src/
│   │   ├── components/    # Composants React
│   │   ├── pages/         # Pages de l'application
│   │   ├── services/      # Services API
│   │   ├── store/         # Redux store
│   │   ├── hooks/         # Custom hooks
│   │   ├── utils/         # Fonctions utilitaires
│   │   ├── App.tsx        # Composant principal
│   │   └── main.tsx       # Point d'entrée
│   ├── package.json
│   └── vite.config.ts
│
├── shared/                # Code partagé (types, schémas)
│   ├── src/
│   │   ├── types/        # Types TypeScript
│   │   ├── schemas/      # Schémas Zod
│   │   └── utils/        # Utilitaires communs
│   └── package.json
│
├── README.md             # Ce fichier
├── INSTALLATION.md       # Guide d'installation
├── STRUCTURE.md          # Structure détaillée
└── package.json          # Scripts racine
```

---

## 🚀 DÉMARRAGE RAPIDE

### **Prérequis**
- Node.js 18+ 
- PostgreSQL 14+
- npm ou yarn

### **Installation**

```bash
# 1. Cloner le projet
cd budget-app

# 2. Installer toutes les dépendances
npm install

# 3. Configuration du backend
cd backend
cp .env.example .env
# Éditer .env avec vos paramètres PostgreSQL

# 4. Configuration du frontend
cd ../frontend
cp .env.example .env

# 5. Initialiser la base de données
cd ../backend
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed

# 6. Démarrer l'application
npm run dev  # Depuis la racine (lance backend + frontend)
```

### **URLs d'accès**
- Frontend : http://localhost:5173
- Backend : http://localhost:5000
- API Docs : http://localhost:5000/api/v1/health

---

## 🏗️ ARCHITECTURE

### **Backend (Node.js + Express)**

#### **Technologies**
- Express.js 4.21
- Prisma 6.4 (ORM)
- PostgreSQL
- JWT + bcrypt (sécurité)
- Zod (validation)

#### **Structure MVC**
```
Controllers → Services → Prisma → Database
     ↓          ↓
  Routes    Business Logic
```

#### **Endpoints API Principaux**
| Méthode | Endpoint | Description |
|---------|----------|-------------|
| POST | `/api/v1/auth/register` | Inscription |
| POST | `/api/v1/auth/login` | Connexion |
| GET | `/api/v1/budgets` | Liste des budgets |
| GET | `/api/v1/budgets/active` | Budget actif |
| POST | `/api/v1/budgets` | Créer un budget |
| GET | `/api/v1/transactions` | Transactions |
| POST | `/api/v1/transactions` | Nouvelle transaction |

**Documentation complète** : Voir `backend/API_DOCUMENTATION.md`

---

### **Frontend (React + TypeScript)**

#### **Technologies**
- React 18.3
- TypeScript 5.6
- Redux Toolkit 2.5
- React Router 7.1
- Tailwind CSS 3.4
- Vite 6.0

#### **Architecture Redux**
```
Components → Hooks → Redux Store → Services → API
                ↓
            UI State
```

#### **Pages Principales**
1. **Dashboard** : Vue d'ensemble du budget actuel
2. **Budgets** : Gestion des budgets mensuels
3. **Transactions** : Historique des transactions
4. **Login/Register** : Authentification

---

## 📊 MODÈLE DE DONNÉES

### **Entités Principales**

```prisma
User {
  id, email, password, name
  budgets: Budget[]
}

Budget {
  id, name, amount, month, year
  user: User
  subBudgets: SubBudget[]
  isActive, isArchived
}

SubBudget {
  id, name, target, spent
  category: SubBudgetCategory (ENUM)
  budget: Budget
  transactions: Transaction[]
}

Transaction {
  id, description, amount, date
  type: TransactionType (INCOME/EXPENSE)
  subBudget: SubBudget
}
```

### **Catégories de Sous-Budgets**
- 💰 SAVINGS (Épargne)
- 📈 INVESTMENT (Investissement)
- 🛒 GROCERIES (Courses)
- 🏠 RENT (Loyer)
- ⚡ BILLS (Factures)
- 🚗 TRANSPORT
- 🍽️ DINING (Restaurants)
- 🎬 ENTERTAINMENT (Loisirs)
- 👕 CLOTHING (Vêtements)
- 🏥 HEALTH (Santé)
- 📚 EDUCATION
- ✈️ TRAVEL (Voyages)
- 🎁 GIFTS (Cadeaux)
- 🔧 MAINTENANCE
- 📱 SUBSCRIPTIONS (Abonnements)
- 📦 OTHER (Autre)

---

## 🔐 SÉCURITÉ

### **Authentification JWT**
- Access token : 15 minutes
- Refresh token : 7 jours
- Stockage sécurisé (httpOnly cookies backend)
- Auto-refresh côté frontend

### **Protection**
- ✅ bcrypt (12 rounds) pour les mots de passe
- ✅ CORS configuré
- ✅ Helmet (sécurité headers)
- ✅ Rate limiting (100 req/15min)
- ✅ Validation Zod côté serveur
- ✅ Routes protégées JWT

---

## 🎨 FONCTIONNALITÉS

### **✅ Implémentées**

#### **Authentification**
- [x] Inscription / Connexion
- [x] JWT (access + refresh tokens)
- [x] Profil utilisateur
- [x] Déconnexion
- [x] Routes protégées

#### **Gestion des Budgets**
- [x] Créer un budget mensuel
- [x] Voir tous les budgets
- [x] Budget actif (mois en cours)
- [x] Résumé du budget (dépensé, restant, %)
- [x] Archiver / Dupliquer budget

#### **Sous-Budgets**
- [x] 16 catégories prédéfinies
- [x] Créer / Modifier / Supprimer
- [x] Couleurs personnalisées
- [x] Montant cible
- [x] Suivi en temps réel

#### **Transactions**
- [x] Créer une transaction (revenu/dépense)
- [x] Liste des transactions
- [x] Filtres et recherche
- [x] Statistiques

#### **Interface**
- [x] Dashboard responsive
- [x] Mode sombre/clair
- [x] Notifications toast
- [x] Graphiques de progression
- [x] Design moderne Tailwind CSS

---

### **🚧 À Développer (Suggestions)**

#### **Fonctionnalités Avancées**
- [ ] Graphiques interactifs (Recharts)
- [ ] Export PDF/Excel
- [ ] Multi-devises
- [ ] Transactions récurrentes
- [ ] Objectifs d'épargne
- [ ] Alertes personnalisées
- [ ] Partage de budget (multi-utilisateurs)

#### **Analytics**
- [ ] Graphiques mensuels/annuels
- [ ] Tendances de dépenses
- [ ] Prévisions
- [ ] Rapports personnalisés

#### **Mobile**
- [ ] Progressive Web App (PWA)
- [ ] Application mobile React Native

---

## 🧪 TESTS

### **Backend**
```bash
cd backend
npm run test              # Tests unitaires
npm run test:integration  # Tests d'intégration
npm run test:e2e         # Tests E2E
```

### **Frontend**
```bash
cd frontend
npm run test             # Vitest
npm run test:ui          # Interface de test
```

---

## 🚀 DÉPLOIEMENT

### **Backend**
**Plateformes recommandées** :
- Railway
- Render
- Heroku
- AWS EC2

**Base de données** :
- Supabase (PostgreSQL)
- Railway PostgreSQL
- AWS RDS

### **Frontend**
**Plateformes recommandées** :
- Vercel (recommandé)
- Netlify
- AWS S3 + CloudFront

### **Configuration Production**

#### **Backend (.env)**
```env
NODE_ENV=production
DATABASE_URL=postgresql://user:pass@host:5432/db
JWT_ACCESS_SECRET=xxx
JWT_REFRESH_SECRET=yyy
FRONTEND_URL=https://votre-app.com
```

#### **Frontend (.env)**
```env
VITE_API_BASE_URL=https://api.votre-app.com
```

---

## 📚 DOCUMENTATION

### **Fichiers Disponibles**
1. `README.md` - Vue d'ensemble (ce fichier)
2. `INSTALLATION.md` - Guide d'installation détaillé
3. `STRUCTURE.md` - Structure complète du projet
4. `backend/API_DOCUMENTATION.md` - Documentation API REST
5. `backend/README.md` - Guide backend
6. `FRONTEND_COMPLETE.md` - Documentation frontend

---

## 🛠️ SCRIPTS UTILES

### **Racine du projet**
```bash
npm run dev          # Lance backend + frontend
npm run build        # Build production
npm install          # Install toutes les dépendances
```

### **Backend**
```bash
npm run dev                 # Serveur de développement
npm run build              # Build TypeScript
npm run start              # Serveur production
npm run prisma:generate    # Générer Prisma Client
npm run prisma:migrate     # Appliquer migrations
npm run prisma:seed        # Charger données de test
npm run prisma:studio      # Interface admin Prisma
```

### **Frontend**
```bash
npm run dev         # Serveur de développement
npm run build       # Build production
npm run preview     # Prévisualiser build
npm run lint        # Vérifier le code
```

---

## 📊 STATISTIQUES DU PROJET

| Composant | Fichiers | Lignes de code |
|-----------|----------|----------------|
| **Backend** | 22 | ~2,820 |
| **Frontend** | 30 | ~3,500 |
| **Shared** | 4 | ~600 |
| **Total** | **56** | **~6,920** |

### **Endpoints API** : 29
### **Composants React** : 15
### **Redux Slices** : 4
### **Modèles Prisma** : 11

---

## 🤝 CONTRIBUTION

### **Ajouter une nouvelle fonctionnalité**

1. **Backend** :
   - Ajouter modèle dans `prisma/schema.prisma`
   - Créer migration : `npm run prisma:migrate`
   - Créer service dans `src/services/`
   - Créer contrôleur dans `src/controllers/`
   - Ajouter route dans `src/routes/`

2. **Frontend** :
   - Créer slice Redux dans `src/store/slices/`
   - Créer service API dans `src/services/`
   - Créer composants dans `src/components/`
   - Créer page dans `src/pages/`
   - Ajouter route dans `src/App.tsx`

---

## 🐛 DÉBOGAGE

### **Backend ne démarre pas**
```bash
# Vérifier PostgreSQL
psql -U postgres
# Vérifier .env
cat backend/.env
# Régénérer Prisma
cd backend && npm run prisma:generate
```

### **Frontend ne se connecte pas**
```bash
# Vérifier l'URL API dans frontend/.env
cat frontend/.env
# Vérifier CORS dans backend/src/config/index.ts
```

### **Erreurs de base de données**
```bash
# Réinitialiser la base
cd backend
npm run prisma:migrate:reset
npm run prisma:seed
```

---

## 📞 SUPPORT

### **Ressources**
- [Prisma Docs](https://www.prisma.io/docs)
- [React Docs](https://react.dev)
- [Redux Toolkit](https://redux-toolkit.js.org)
- [Tailwind CSS](https://tailwindcss.com)
- [Express.js](https://expressjs.com)

---

## 📝 LICENCE

Ce projet est un exemple éducatif. Libre d'utilisation et de modification.

---

## 🎉 CONCLUSION

**Budget Manager** est une application complète et production-ready avec :
- ✅ Backend robuste et sécurisé
- ✅ Frontend moderne et responsive
- ✅ Architecture scalable
- ✅ Documentation complète
- ✅ Prête pour le déploiement

**Prochaine étape** : Tester l'application complète et ajouter vos fonctionnalités personnalisées !

---

**Version** : 1.0.0  
**Date** : 4 février 2026  
**Statut** : ✅ Production Ready
