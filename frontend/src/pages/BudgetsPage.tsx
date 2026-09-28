import React, { useEffect, useState } from 'react';
import { MainLayout } from '../components/layout/MainLayout';
import { Card, CardHeader, CardTitle, CardContent } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Spinner } from '../components/common/Spinner';
import { Modal, ModalFooter } from '../components/common/Modal';
import { Input } from '../components/common/Input';
import { useAppDispatch, useAppSelector } from '../hooks/useRedux';
import { fetchBudgets, createBudget } from '../store/slices/budgetSlice';
import { formatCurrency, formatDate } from '../utils/format';
import { addToast } from '../store/slices/uiSlice';

export const BudgetsPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { budgets, loading } = useAppSelector((state) => state.budget);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    amount: '',
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
  });

  useEffect(() => {
    dispatch(fetchBudgets(false));
  }, [dispatch]);

  const handleCreateBudget = async () => {
    if (!formData.name || !formData.amount) {
      dispatch(addToast({
        type: 'error',
        message: 'Veuillez remplir tous les champs',
      }));
      return;
    }

    setCreateLoading(true);
    try {
          // AVANT (buggé) :
          // amount: parseFloat(formData.amount),
          
          // APRÈS (corrigé avec totalAmount) :
          await dispatch(createBudget({
            name: formData.name,
            totalAmount: parseFloat(formData.amount),
            month: Number(formData.month),
            year: Number(formData.year),
        } as any)).unwrap();

      dispatch(addToast({
        type: 'success',
        message: 'Budget créé avec succès !',
      }));
      setIsCreateModalOpen(false);
      setFormData({
        name: '',
        amount: '',
        month: new Date().getMonth() + 1,
        year: new Date().getFullYear(),
      });
    } catch (error: any) {
      dispatch(addToast({
        type: 'error',
        message: error.message || 'Erreur lors de la création du budget',
      }));
    } finally {
      setCreateLoading(false);
    }
  };

  if (loading && budgets.length === 0) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-96">
          <Spinner size="lg" />
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              Mes Budgets
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Gérez tous vos budgets mensuels
            </p>
          </div>
          <Button onClick={() => setIsCreateModalOpen(true)}>
            Créer un budget
          </Button>
        </div>

        {/* Budgets List */}
        {budgets.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <svg
                className="w-16 h-16 text-gray-400 mx-auto mb-4"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                Aucun budget
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Commencez par créer votre premier budget mensuel
              </p>
              <Button onClick={() => setIsCreateModalOpen(true)}>
                Créer un budget
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {budgets.map((budget: any) => (
              <Card key={budget.id} hover>
                <CardHeader>
                  <CardTitle>{budget.name}</CardTitle>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {budget.month}/{budget.year}
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Budget total</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                        formatCurrency(budget.totalAmount || budget.amount || 0)
                      </p>
                    </div>
                    <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Statut</span>
                        <span
                          className={
                            budget.isActive
                              ? 'text-green-600 font-medium'
                              : 'text-gray-500'
                          }
                        >
                          {budget.isActive ? 'Actif' : 'Archivé'}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm mt-2">
                        <span className="text-gray-600 dark:text-gray-400">Créé le</span>
                        <span className="text-gray-900 dark:text-gray-100">
                          {formatDate(budget.createdAt)}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <div className="px-4 pb-4">
                  <Button variant="outline" size="sm" fullWidth>
                    Voir les détails
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Create Budget Modal */}
        <Modal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          title="Créer un nouveau budget"
        >
          <div className="space-y-4">
            <Input
              label="Nom du budget"
              placeholder="Budget Février 2026"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
            <Input
              label="Montant total (€)"
              type="number"
              placeholder="2500"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
            />
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Mois"
                type="number"
                min="1"
                max="12"
                value={formData.month}
                onChange={(e) =>
                  setFormData({ ...formData, month: parseInt(e.target.value) })
                }
              />
              <Input
                label="Année"
                type="number"
                min="2020"
                max="2030"
                value={formData.year}
                onChange={(e) =>
                  setFormData({ ...formData, year: parseInt(e.target.value) })
                }
              />
            </div>
          </div>

          <ModalFooter>
            <Button
              variant="ghost"
              onClick={() => setIsCreateModalOpen(false)}
              disabled={createLoading}
            >
              Annuler
            </Button>
            <Button onClick={handleCreateBudget} isLoading={createLoading}>
              Créer
            </Button>
          </ModalFooter>
        </Modal>
      </div>
    </MainLayout>
  );
};
