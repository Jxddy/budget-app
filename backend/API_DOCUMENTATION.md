# 📚 Documentation API Backend - Budget Manager

## 🎯 URL de Base

```
http://localhost:5000/api/v1
```

---

## 🔐 Authentification

Toutes les routes protégées nécessitent un token JWT dans le header :

```
Authorization: Bearer <votre_token>
```

---

## 📋 Routes API

### **Authentication** `/auth`

#### 1. Inscription
```http
POST /api/v1/auth/register
```

**Body:**
```json
{
  "email": "user@example.com",
  "password": "Password123!",
  "firstName": "Jean",
  "lastName": "Dupont"
}
```

**Réponse (201):**
```json
{
  "success": true,
  "message": "Inscription réussie",
  "data": {
    "user": {
      "id": "clxxx...",
      "email": "user@example.com",
      "firstName": "Jean",
      "lastName": "Dupont"
    },
    "accessToken": "eyJhbGc...",
    "refreshToken": "eyJhbGc..."
  }
}
```

#### 2. Connexion
```http
POST /api/v1/auth/login
```

**Body:**
```json
{
  "email": "user@example.com",
  "password": "Password123!"
}
```

#### 3. Profil utilisateur
```http
GET /api/v1/auth/profile
```
🔒 **Protégé** - Nécessite authentification

#### 4. Mettre à jour le profil
```http
PATCH /api/v1/auth/profile
```
🔒 **Protégé**

**Body:**
```json
{
  "firstName": "Jean",
  "lastName": "Martin",
  "currency": "EUR",
  "darkMode": true
}
```

#### 5. Changer le mot de passe
```http
POST /api/v1/auth/change-password
```
🔒 **Protégé**

**Body:**
```json
{
  "oldPassword": "Password123!",
  "newPassword": "NewPassword456!"
}
```

---

### **Budgets** `/budgets`

🔒 **Toutes les routes nécessitent une authentification**

#### 1. Créer un budget
```http
POST /api/v1/budgets
```

**Body:**
```json
{
  "name": "Budget Janvier 2026",
  "description": "Budget mensuel",
  "month": 1,
  "year": 2026,
  "totalAmount": 3500.00
}
```

**Réponse (201):**
```json
{
  "success": true,
  "message": "Budget créé avec succès",
  "data": {
    "id": "clxxx...",
    "name": "Budget Janvier 2026",
    "month": 1,
    "year": 2026,
    "totalAmount": 3500.00,
    "isActive": true
  }
}
```

#### 2. Obtenir tous les budgets
```http
GET /api/v1/budgets?includeArchived=false
```

**Query Parameters:**
- `includeArchived` (boolean, optionnel): Inclure les budgets archivés

#### 3. Obtenir le budget actif
```http
GET /api/v1/budgets/active
```

**Réponse:**
```json
{
  "success": true,
  "data": {
    "budget": { ... },
    "totalSpent": 2150.00,
    "totalTarget": 3500.00,
    "remaining": 1350.00,
    "percentageUsed": 61.43,
    "subBudgets": [ ... ]
  }
}
```

#### 4. Obtenir un budget par ID
```http
GET /api/v1/budgets/:id
```

#### 5. Obtenir le résumé d'un budget
```http
GET /api/v1/budgets/:id/summary
```

#### 6. Mettre à jour un budget
```http
PATCH /api/v1/budgets/:id
```

**Body:**
```json
{
  "name": "Budget Janvier - Modifié",
  "totalAmount": 4000.00,
  "isActive": true
}
```

#### 7. Archiver un budget
```http
POST /api/v1/budgets/:id/archive
```

#### 8. Dupliquer un budget
```http
POST /api/v1/budgets/:id/duplicate
```

**Body:**
```json
{
  "month": 2,
  "year": 2026
}
```

#### 9. Supprimer un budget
```http
DELETE /api/v1/budgets/:id
```

---

### **Sous-Budgets** `/sub-budgets`

🔒 **Toutes les routes nécessitent une authentification**

#### 1. Créer un sous-budget
```http
POST /api/v1/sub-budgets
```

**Body:**
```json
{
  "budgetId": "clxxx...",
  "name": "Épargne Vacances",
  "description": "Pour les vacances d'été",
  "category": "SAVINGS",
  "targetAmount": 500.00,
  "color": "#10B981",
  "icon": "✈️",
  "alertThreshold": 80
}
```

**Catégories disponibles:**
- `SAVINGS` - Épargne
- `INVESTMENT` - Investissement
- `DAILY_EXPENSES` - Dépenses courantes
- `BILLS` - Factures
- `RENT` - Loyer
- `ENTERTAINMENT` - Divertissement
- `TRANSPORTATION` - Transport
- `FOOD` - Alimentation
- `HEALTH` - Santé
- `EDUCATION` - Éducation
- `SHOPPING` - Achats
- `TRAVEL` - Voyages
- `SPORT` - Sport
- `GIFTS` - Cadeaux
- `PETS` - Animaux
- `OTHER` - Autre

#### 2. Obtenir les sous-budgets d'un budget
```http
GET /api/v1/budgets/:budgetId/sub-budgets
```

**Réponse:**
```json
{
  "success": true,
  "data": [
    {
      "id": "clxxx...",
      "name": "Épargne Vacances",
      "category": "SAVINGS",
      "targetAmount": 500.00,
      "currentAmount": 450.00,
      "color": "#10B981",
      "icon": "✈️",
      "percentageUsed": 90.00,
      "transactionCount": 5
    }
  ]
}
```

#### 3. Obtenir un sous-budget par ID
```http
GET /api/v1/sub-budgets/:id
```

#### 4. Obtenir les statistiques d'un sous-budget
```http
GET /api/v1/sub-budgets/:id/stats
```

#### 5. Mettre à jour un sous-budget
```http
PATCH /api/v1/sub-budgets/:id
```

**Body:**
```json
{
  "name": "Épargne Vacances 2026",
  "targetAmount": 600.00,
  "alertThreshold": 85
}
```

#### 6. Réorganiser les sous-budgets
```http
POST /api/v1/budgets/:budgetId/sub-budgets/reorder
```

**Body:**
```json
{
  "orderedIds": ["clxxx1...", "clxxx2...", "clxxx3..."]
}
```

#### 7. Désactiver un sous-budget
```http
POST /api/v1/sub-budgets/:id/deactivate
```

#### 8. Supprimer un sous-budget
```http
DELETE /api/v1/sub-budgets/:id
```

---

### **Transactions** `/transactions`

🔒 **Toutes les routes nécessitent une authentification**

#### 1. Créer une transaction
```http
POST /api/v1/transactions
```

**Body:**
```json
{
  "subBudgetId": "clxxx...",
  "type": "EXPENSE",
  "amount": 45.50,
  "description": "Supermarché Carrefour",
  "notes": "Courses hebdomadaires",
  "date": "2026-02-04T10:30:00Z",
  "tags": ["alimentation", "courses"],
  "merchant": "Carrefour",
  "location": "Paris 15e"
}
```

**Types de transaction:**
- `INCOME` - Revenu
- `EXPENSE` - Dépense

**Réponse (201):**
```json
{
  "success": true,
  "message": "Transaction créée avec succès",
  "data": {
    "id": "clxxx...",
    "type": "EXPENSE",
    "amount": 45.50,
    "description": "Supermarché Carrefour",
    "status": "COMPLETED",
    "subBudget": {
      "id": "clxxx...",
      "name": "Courses",
      "category": "FOOD"
    }
  }
}
```

#### 2. Obtenir les transactions (avec filtres)
```http
GET /api/v1/transactions?page=1&pageSize=20&type=EXPENSE&startDate=2026-01-01
```

**Query Parameters:**
- `page` (number): Numéro de page (défaut: 1)
- `pageSize` (number): Éléments par page (défaut: 20, max: 100)
- `type` (string): INCOME ou EXPENSE
- `subBudgetId` (string): Filtrer par sous-budget
- `categoryId` (string): Filtrer par catégorie
- `search` (string): Recherche textuelle
- `startDate` (ISO date): Date de début
- `endDate` (ISO date): Date de fin
- `minAmount` (number): Montant minimum
- `maxAmount` (number): Montant maximum

**Réponse:**
```json
{
  "success": true,
  "data": {
    "data": [ ... ],
    "total": 150,
    "page": 1,
    "pageSize": 20,
    "totalPages": 8
  }
}
```

#### 3. Obtenir une transaction par ID
```http
GET /api/v1/transactions/:id
```

#### 4. Obtenir les statistiques des transactions
```http
GET /api/v1/transactions/stats?startDate=2026-01-01&endDate=2026-01-31
```

**Réponse:**
```json
{
  "success": true,
  "data": {
    "totalIncome": 2500.00,
    "totalExpense": 2150.00,
    "balance": 350.00,
    "transactionCount": 45
  }
}
```

#### 5. Mettre à jour une transaction
```http
PATCH /api/v1/transactions/:id
```

**Body:**
```json
{
  "amount": 50.00,
  "description": "Supermarché Carrefour (modifié)",
  "status": "COMPLETED"
}
```

#### 6. Supprimer une transaction
```http
DELETE /api/v1/transactions/:id
```

---

## 🔍 Codes de Statut HTTP

| Code | Description |
|------|-------------|
| 200  | Succès |
| 201  | Créé avec succès |
| 400  | Requête invalide |
| 401  | Non authentifié |
| 403  | Accès interdit |
| 404  | Ressource non trouvée |
| 409  | Conflit (ex: ressource existante) |
| 422  | Erreur de validation |
| 429  | Trop de requêtes |
| 500  | Erreur serveur |

---

## ⚠️ Format des Erreurs

```json
{
  "success": false,
  "message": "Message d'erreur principal",
  "errors": [
    {
      "field": "email",
      "message": "Email invalide"
    }
  ]
}
```

---

## 🧪 Exemple d'Utilisation (cURL)

### 1. S'inscrire
```bash
curl -X POST http://localhost:5000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Password123!",
    "firstName": "Test"
  }'
```

### 2. Se connecter
```bash
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Password123!"
  }'
```

### 3. Créer un budget (avec token)
```bash
curl -X POST http://localhost:5000/api/v1/budgets \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer VOTRE_TOKEN" \
  -d '{
    "name": "Budget Test",
    "month": 2,
    "year": 2026,
    "totalAmount": 3000
  }'
```

---

## 📝 Notes Importantes

1. **Tous les montants** sont en décimales (ex: 45.50)
2. **Les dates** doivent être au format ISO 8601
3. **Les tokens JWT** expirent après 7 jours par défaut
4. **Rate limiting**: 100 requêtes par 15 minutes
5. **Pagination**: Maximum 100 éléments par page

---

## 🔗 Ressources

- Code source: `/backend/src`
- Schéma Prisma: `/backend/prisma/schema.prisma`
- Variables d'environnement: `/backend/.env.example`
