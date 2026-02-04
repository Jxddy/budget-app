import React, { useEffect } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { Card, Text, Button, ProgressBar } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { fetchActiveBudget, fetchBudgetSummary } from '../store/slices/budgetSlice';
import { AppDispatch, RootState } from '../store';

export default function DashboardScreen({ navigation }: any) {
  const dispatch = useDispatch<AppDispatch>();
  const { activeBudget, budgetSummary, loading } = useSelector(
    (state: RootState) => state.budget
  );

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    await dispatch(fetchActiveBudget()).unwrap();
    if (activeBudget?.id) {
      dispatch(fetchBudgetSummary(activeBudget.id));
    }
  };

  if (!activeBudget) {
    return (
      <View style={styles.emptyContainer}>
        <Text variant="headlineSmall" style={styles.emptyText}>
          Aucun budget actif
        </Text>
        <Text variant="bodyMedium" style={styles.emptySubtext}>
          Créez votre premier budget pour commencer
        </Text>
        <Button
          mode="contained"
          onPress={() => navigation.navigate('CreateBudget')}
          style={styles.createButton}
        >
          Créer un budget
        </Button>
      </View>
    );
  }

  const totalBudget = activeBudget.amount;
  const totalSpent = budgetSummary?.totalSpent || 0;
  const totalRemaining = totalBudget - totalSpent;
  const spentPercentage = (totalSpent / totalBudget);

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={loading} onRefresh={loadData} />
      }
    >
      <View style={styles.header}>
        <Text variant="headlineMedium" style={styles.title}>
          Tableau de bord
        </Text>
        <Text variant="bodyMedium" style={styles.subtitle}>
          {activeBudget.month}/{activeBudget.year}
        </Text>
      </View>

      {/* Budget Overview Cards */}
      <View style={styles.cardsRow}>
        <Card style={[styles.card, { flex: 1, marginRight: 8 }]}>
          <Card.Content>
            <Text variant="bodySmall" style={styles.cardLabel}>
              Budget total
            </Text>
            <Text variant="headlineSmall" style={styles.cardValue}>
              {totalBudget}€
            </Text>
          </Card.Content>
        </Card>

        <Card style={[styles.card, { flex: 1, marginLeft: 8 }]}>
          <Card.Content>
            <Text variant="bodySmall" style={styles.cardLabel}>
              Dépensé
            </Text>
            <Text variant="headlineSmall" style={[styles.cardValue, { color: '#EF4444' }]}>
              {totalSpent}€
            </Text>
          </Card.Content>
        </Card>
      </View>

      <Card style={styles.card}>
        <Card.Content>
          <Text variant="bodySmall" style={styles.cardLabel}>
            Restant
          </Text>
          <Text
            variant="headlineSmall"
            style={[
              styles.cardValue,
              { color: totalRemaining >= 0 ? '#10B981' : '#EF4444' },
            ]}
          >
            {totalRemaining}€
          </Text>
        </Card.Content>
      </Card>

      {/* Progress Bar */}
      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleMedium" style={styles.sectionTitle}>
            Progression du budget
          </Text>
          <View style={styles.progressInfo}>
            <Text variant="bodySmall">{totalSpent}€ dépensé</Text>
            <Text variant="bodySmall">
              {(spentPercentage * 100).toFixed(1)}%
            </Text>
          </View>
          <ProgressBar
            progress={spentPercentage}
            color={
              spentPercentage >= 0.9
                ? '#EF4444'
                : spentPercentage >= 0.75
                ? '#F59E0B'
                : '#10B981'
            }
            style={styles.progressBar}
          />
        </Card.Content>
      </Card>

      {/* Sub-budgets */}
      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.sectionHeader}>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              Sous-budgets
            </Text>
            <Button mode="text" onPress={() => navigation.navigate('Budgets')}>
              Voir tout
            </Button>
          </View>

          {budgetSummary?.subBudgets?.slice(0, 5).map((subBudget: any) => {
            const percentage = (subBudget.spent / subBudget.target);
            return (
              <View key={subBudget.id} style={styles.subBudgetItem}>
                <View style={styles.subBudgetHeader}>
                  <View style={styles.subBudgetName}>
                    <View
                      style={[
                        styles.colorDot,
                        { backgroundColor: subBudget.color },
                      ]}
                    />
                    <Text variant="bodyMedium">{subBudget.name}</Text>
                  </View>
                  <Text variant="bodySmall" style={styles.subBudgetAmount}>
                    {subBudget.spent}€ / {subBudget.target}€
                  </Text>
                </View>
                <ProgressBar
                  progress={percentage}
                  color={subBudget.color}
                  style={styles.subBudgetProgress}
                />
              </View>
            );
          })}
        </Card.Content>
      </Card>

      <Button
        mode="contained"
        icon="plus"
        onPress={() => navigation.navigate('CreateTransaction')}
        style={styles.fabButton}
      >
        Nouvelle transaction
      </Button>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  emptyText: {
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtext: {
    marginBottom: 24,
    textAlign: 'center',
    color: '#666',
  },
  createButton: {
    marginTop: 16,
  },
  header: {
    padding: 16,
    backgroundColor: '#fff',
    marginBottom: 16,
  },
  title: {
    fontWeight: 'bold',
  },
  subtitle: {
    color: '#666',
    marginTop: 4,
  },
  cardsRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  card: {
    marginHorizontal: 16,
    marginBottom: 16,
  },
  cardLabel: {
    color: '#666',
    marginBottom: 4,
  },
  cardValue: {
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontWeight: 'bold',
    marginBottom: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  progressInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  progressBar: {
    height: 12,
    borderRadius: 6,
  },
  subBudgetItem: {
    marginBottom: 16,
  },
  subBudgetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  subBudgetName: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  colorDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  subBudgetAmount: {
    color: '#666',
  },
  subBudgetProgress: {
    height: 8,
    borderRadius: 4,
  },
  fabButton: {
    margin: 16,
  },
});
