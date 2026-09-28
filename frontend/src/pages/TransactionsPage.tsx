import React, { useEffect, useState } from 'react';
import { MainLayout } from '../components/layout/MainLayout';
import { Card, CardHeader, CardTitle, CardContent } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Spinner } from '../components/common/Spinner';
import { Modal, ModalFooter } from '../components/common/Modal';
import { Input } from '../components/common/Input';
import { useAppDispatch, useAppSelector } from '../hooks/useRedux';
import { fetchTransactions, createTransaction } from '../store/slices/transactionSlice';
import { fetchBudgets } from '../store/slices/budgetSlice';
import { formatCurrency, formatDate } from '../utils/format';
import { addToast } from '../store/slices/uiSlice';

export const TransactionsPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { transactions, loading } = useAppSelector((state) => state.transaction);
  const { budgets } = useAppSelector((state) => state.budget);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    type: 'EXPENSE', // ou 'INCOME'
    category: 'Alimentation',
    date: new Date().toISOString().split('T')[0],
    subBudgetId: '',
  });

  useEffect(() => {
    dispatch(fetchTransactions({ page: 1, limit: 50 }));
    dispatch(fetchBudgets(false));
  }, [dispatch]);

  const handleCreate = async () => {
    if (!formData.description || !formData.amount) {
      dispatch(addToast({ type: 'error', message: 'Veuillez saisir une description et un montant' }));
      return;
    }

    setSubmitting(true);
    try {
      await dispatch(
        createTransaction({
          description: formData.description,
          amount: parseFloat(formData.amount),
          type: formData.type as 'EXPENSE' | 'INCOME',
          category: formData.category,
          date: new Date(formData.date).toISOString(),
          subBudgetId: formData.subBudgetId || undefined,
        } as any)
      ).unwrap();

      dispatch(addToast({ type: 'success', message: 'Transaction ajoutée avec succès !' }));
      setIsModalOpen(false);
      setFormData({
        description: '',
        amount: '',
        type: 'EXPENSE',
        category: 'Alimentation',
        date: new Date().toISOString().split('T')[0],
        subBudgetId: '',
      });
      dispatch(fetchTransactions({ page: 1, limit: 50 }));
    } catch (err: any) {
      dispatch(addToast({ type: 'error', message: err || "Erreur lors de l'ajout" }));
    } finally {
      setSubmitting(false);
    }
  };

  if (loading && transactions.length === 0) {
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
              Transactions
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Historique de toutes vos transactions
            </p>
          </div>
          <Button onClick={() => setIsModalOpen(true)}>Nouvelle transaction</Button>
        </div>

        {/* Transactions List */}
        {transactions.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 text-gray-400 rounded-full flex items-center justify-center mx-auto mb-4">
                📋
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                Aucune transaction
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Commencez à suivre vos dépenses et revenus
              </p>
              <Button onClick={() => setIsModalOpen(true)}>Ajouter une transaction</Button>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {transactions.map((tx: any) => (
                <div key={tx.id} className="p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800/50 transition">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-lg ${
                      tx.type === 'INCOME' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {tx.type === 'INCOME' ? '+' : '-'}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-gray-100">{tx.description}</p>
                      <p className="text-xs text-gray-500">{tx.category} • {formatDate(tx.date || tx.createdAt)}</p>
                    </div>
                  </div>
                  <div className={`font-bold text-lg ${tx.type === 'INCOME' ? 'text-green-600' : 'text-gray-900 dark:text-gray-100'}`}>
                    {tx.type === 'INCOME' ? '+' : '-'}{formatCurrency(tx.amount)}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Modal d'ajout de transaction */}
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Nouvelle Transaction">
          <div className="space-y-4">
            {/* Type */}
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, type: 'EXPENSE' })}
                className={`flex-1 py-2 rounded-lg font-medium text-sm border transition ${
                  formData.type === 'EXPENSE'
                    ? 'bg-red-50 border-red-500 text-red-600 font-bold'
                    : 'border-gray-200 text-gray-600'
                }`}
              >
                💸 Dépense
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, type: 'INCOME' })}
                className={`flex-1 py-2 rounded-lg font-medium text-sm border transition ${
                  formData.type === 'INCOME'
                    ? 'bg-green-50 border-green-500 text-green-600 font-bold'
                    : 'border-gray-200 text-gray-600'
                }`}
              >
                💰 Revenu
              </button>
            </div>

            <Input
              label="Description"
              placeholder="ex: Courses supermarché, Salaire..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />

            <Input
              label="Montant"
              type="number"
              placeholder="50"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Catégorie
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              >
                <option value="Alimentation">Alimentation</option>
                <option value="Logement">Logement & Charges</option>
                <option value="Transport">Transport</option>
                <option value="Loisirs">Loisirs & Sorties</option>
                <option value="Santé">Santé</option>
                <option value="Salaire">Salaire & Revenus</option>
                <option value="Autre">Autre</option>
              </select>
            </div>

            <Input
              label="Date"
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            />
          </div>

          <ModalFooter>
            <Button variant="ghost" onClick={() => setIsModalOpen(false)}>Annuler</Button>
            <Button onClick={handleCreate} isLoading={submitting}>Enregistrer</Button>
          </ModalFooter>
        </Modal>
      </div>
    </MainLayout>
  );
};
