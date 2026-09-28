import React, { useEffect } from 'react';
import { MainLayout } from '../components/layout/MainLayout';
import { Card, CardHeader, CardTitle, CardContent } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Spinner } from '../components/common/Spinner';
import { useAppDispatch, useAppSelector } from '../hooks/useRedux';
import { fetchActiveBudget, fetchBudgetSummary } from '../store/slices/budgetSlice';
import { formatCurrency, formatPercentage } from '../utils/format';
import clsx from 'clsx';

export const DashboardPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { activeBudget, budgetSummary, loading } = useAppSelector((state) => state.budget);

  useEffect(() => {
    dispatch(fetchActiveBudget());
    if (activeBudget?.id) {
      dispatch(fetchBudgetSummary(activeBudget.id));
    }
  }, [dispatch, activeBudget?.id]);

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-96">
          <Spinner size="lg" />
        </div>
      </MainLayout>
    );
  }

  if (!activeBudget) {
    return (
      <MainLayout>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Aucun budget actif
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Commencez par créer votre premier budget mensuel
          </p>
          <Button>Créer un budget</Button>
        </div>
      </MainLayout>
    );
  }

  const currentBudget = (activeBudget as any)?.budget || activeBudget;
  const totalBudget = Number(currentBudget?.totalAmount || currentBudget?.amount || 0);
  const totalSpent = Number(budgetSummary?.totalSpent || 0);
  const totalRemaining = totalBudget - totalSpent;
  const spentPercentage = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              Tableau de bord
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              {activeBudget.month}/{activeBudget.year}
            </p>
          </div>
          <Button>Nouvelle transaction</Button>
        </div>

        {/* Budget Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Total Budget */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Budget total</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-1">
                    {formatCurrency(totalBudget)}
                  </p>
                </div>
                <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                  <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                    <path
                      fillRule="evenodd"
                      d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Total Spent */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Dépensé</p>
                  <p className="text-2xl font-bold text-red-600 dark:text-red-400 mt-1">
                    {formatCurrency(totalSpent)}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {formatPercentage(spentPercentage)} du budget
                  </p>
                </div>
                <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-full">
                  <svg className="w-6 h-6 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 0l-2 2a1 1 0 101.414 1.414L8 10.414l1.293 1.293a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Remaining */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Restant</p>
                  <p
                    className={clsx(
                      'text-2xl font-bold mt-1',
                      totalRemaining >= 0
                        ? 'text-green-600 dark:text-green-400'
                        : 'text-red-600 dark:text-red-400'
                    )}
                  >
                    {formatCurrency(totalRemaining)}
                  </p>
                </div>
                <div
                  className={clsx(
                    'p-3 rounded-full',
                    totalRemaining >= 0
                      ? 'bg-green-100 dark:bg-green-900/30'
                      : 'bg-red-100 dark:bg-red-900/30'
                  )}
                >
                  <svg
                    className={clsx(
                      'w-6 h-6',
                      totalRemaining >= 0 ? 'text-green-600' : 'text-red-600'
                    )}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Progress Bar */}
        <Card>
          <CardHeader>
            <CardTitle>Progression du budget</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">
                  {formatCurrency(totalSpent)} dépensé
                </span>
                <span className="font-medium text-gray-900 dark:text-gray-100">
                  {formatPercentage(spentPercentage)}
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 overflow-hidden">
                <div
                  className={clsx(
                    'h-full transition-all duration-500 rounded-full',
                    spentPercentage >= 90
                      ? 'bg-red-600'
                      : spentPercentage >= 75
                      ? 'bg-yellow-600'
                      : 'bg-green-600'
                  )}
                  style={{ width: `${Math.min(spentPercentage, 100)}%` }}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sub-budgets List */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Sous-budgets</CardTitle>
              <Button variant="ghost" size="sm">
                Voir tout
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {budgetSummary?.subBudgets && budgetSummary.subBudgets.length > 0 ? (
              <div className="space-y-4">
                {budgetSummary.subBudgets.slice(0, 5).map((subBudget: any) => {
                  const percentage = (subBudget.spent / subBudget.target) * 100;
                  return (
                    <div key={subBudget.id} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: subBudget.color }}
                          />
                          <span className="font-medium text-gray-900 dark:text-gray-100">
                            {subBudget.name}
                          </span>
                        </div>
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {formatCurrency(subBudget.spent)} / {formatCurrency(subBudget.target)}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div
                          className="h-full rounded-full transition-all"
                          style={{
                            width: `${Math.min(percentage, 100)}%`,
                            backgroundColor: subBudget.color,
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-center text-gray-500 dark:text-gray-400 py-8">
                Aucun sous-budget créé
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};
