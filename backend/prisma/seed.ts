import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Démarrage du seeding...');

  // Créer un utilisateur de test
  const hashedPassword = await bcrypt.hash('Password123!', 12);

  const user = await prisma.user.upsert({
    where: { email: 'demo@budgetapp.com' },
    update: {},
    create: {
      email: 'demo@budgetapp.com',
      passwordHash: hashedPassword,
      firstName: 'Jean',
      lastName: 'Dupont',
      currency: 'EUR',
      darkMode: false,
    },
  });

  console.log('✅ Utilisateur créé:', user.email);

  // Créer un budget pour le mois en cours
  const now = new Date();
  const month = now.getMonth() + 1;
  const year = now.getFullYear();

  const budget = await prisma.budget.create({
    data: {
      userId: user.id,
      name: `Budget ${month}/${year}`,
      month,
      year,
      totalAmount: 3500.0,
      isActive: true,
    },
  });

  console.log('✅ Budget créé:', budget.name);

  // Créer des sous-budgets
  const subBudgets = [
    {
      name: 'Épargne Vacances',
      category: 'SAVINGS',
      targetAmount: 500.0,
      currentAmount: 450.0,
      color: '#10B981',
      icon: '✈️',
      description: 'Économies pour les vacances d\'été',
      alertThreshold: 90,
    },
    {
      name: 'Loyer',
      category: 'RENT',
      targetAmount: 900.0,
      currentAmount: 900.0,
      color: '#3B82F6',
      icon: '🏠',
      description: 'Loyer mensuel',
      alertThreshold: 100,
    },
    {
      name: 'Courses',
      category: 'FOOD',
      targetAmount: 400.0,
      currentAmount: 320.0,
      color: '#F59E0B',
      icon: '🛒',
      description: 'Alimentation et courses',
      alertThreshold: 80,
    },
    {
      name: 'Factures',
      category: 'BILLS',
      targetAmount: 250.0,
      currentAmount: 230.0,
      color: '#EF4444',
      icon: '⚡',
      description: 'Électricité, eau, internet',
      alertThreshold: 90,
    },
    {
      name: 'Transport',
      category: 'TRANSPORTATION',
      targetAmount: 150.0,
      currentAmount: 85.0,
      color: '#8B5CF6',
      icon: '🚗',
      description: 'Essence et transports en commun',
      alertThreshold: 80,
    },
    {
      name: 'Loisirs',
      category: 'ENTERTAINMENT',
      targetAmount: 300.0,
      currentAmount: 165.0,
      color: '#EC4899',
      icon: '🎉',
      description: 'Sorties et divertissements',
      alertThreshold: 75,
    },
  ];

  const createdSubBudgets = [];
  for (const sb of subBudgets) {
    const subBudget = await prisma.subBudget.create({
      data: {
        ...sb,
        budgetId: budget.id,
      },
    });
    createdSubBudgets.push(subBudget);
    console.log('✅ Sous-budget créé:', subBudget.name);
  }

  // Créer des transactions d'exemple
  const transactions = [
    {
      userId: user.id,
      subBudgetId: createdSubBudgets[1].id, // Loyer
      type: 'EXPENSE',
      amount: 900.0,
      description: 'Loyer mensuel',
      date: new Date(year, month - 1, 1),
    },
    {
      userId: user.id,
      subBudgetId: createdSubBudgets[2].id, // Courses
      type: 'EXPENSE',
      amount: 85.5,
      description: 'Supermarché Carrefour',
      date: new Date(year, month - 1, 5),
    },
    {
      userId: user.id,
      subBudgetId: createdSubBudgets[3].id, // Factures
      type: 'EXPENSE',
      amount: 45.0,
      description: 'Facture électricité',
      date: new Date(year, month - 1, 3),
    },
    {
      userId: user.id,
      subBudgetId: createdSubBudgets[0].id, // Épargne
      type: 'INCOME',
      amount: 200.0,
      description: 'Virement épargne',
      date: new Date(year, month - 1, 15),
    },
    {
      userId: user.id,
      subBudgetId: createdSubBudgets[4].id, // Transport
      type: 'EXPENSE',
      amount: 60.0,
      description: 'Essence',
      date: new Date(year, month - 1, 10),
    },
    {
      userId: user.id,
      subBudgetId: createdSubBudgets[5].id, // Loisirs
      type: 'EXPENSE',
      amount: 45.0,
      description: 'Cinéma',
      date: new Date(year, month - 1, 12),
    },
    {
      userId: user.id,
      type: 'INCOME',
      amount: 2500.0,
      description: 'Salaire mensuel',
      date: new Date(year, month - 1, 28),
    },
  ];

  for (const tx of transactions) {
    await prisma.transaction.create({
      data: tx,
    });
  }

  console.log('✅', transactions.length, 'transactions créées');

  // Créer des catégories personnalisées
  const categories = [
    {
      userId: user.id,
      name: 'Restaurants',
      color: '#F59E0B',
      icon: '🍽️',
    },
    {
      userId: user.id,
      name: 'Vêtements',
      color: '#EC4899',
      icon: '👕',
    },
    {
      userId: user.id,
      name: 'Cadeaux',
      color: '#8B5CF6',
      icon: '🎁',
    },
  ];

  for (const cat of categories) {
    await prisma.category.create({
      data: cat,
    });
  }

  console.log('✅', categories.length, 'catégories créées');

  // Créer une alerte
  await prisma.alert.create({
    data: {
      userId: user.id,
      type: 'BUDGET_LIMIT',
      priority: 'MEDIUM',
      title: 'Limite de budget approchée',
      message: '⚠️ Le sous-budget "Épargne Vacances" a atteint 90% de son objectif!',
      isRead: false,
    },
  });

  console.log('✅ Alerte créée');

  // Créer un objectif d'épargne
  await prisma.savingsGoal.create({
    data: {
      userId: user.id,
      name: 'Nouvelle voiture',
      description: 'Épargner pour acheter une nouvelle voiture',
      targetAmount: 15000.0,
      currentAmount: 3500.0,
      targetDate: new Date(year + 1, 6, 1),
      icon: '🚗',
      color: '#3B82F6',
      status: 'IN_PROGRESS',
    },
  });

  console.log('✅ Objectif d\'épargne créé');

  console.log('');
  console.log('🎉 Seeding terminé avec succès!');
  console.log('');
  console.log('📧 Email de test: demo@budgetapp.com');
  console.log('🔑 Mot de passe: Password123!');
}

main()
  .catch((e) => {
    console.error('❌ Erreur lors du seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
