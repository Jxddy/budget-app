import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAppSelector } from './hooks/useRedux';

import * as MainLayoutModule from './components/layout/MainLayout';
import * as ProtectedRouteModule from './components/auth/ProtectedRoute';
import * as LoginModule from './pages/LoginPage';
import * as RegisterModule from './pages/RegisterPage';
import * as DashboardModule from './pages/DashboardPage';
import * as BudgetsModule from './pages/BudgetsPage';
import * as TransactionsModule from './pages/TransactionsPage';

const MainLayout = (MainLayoutModule as any).default || (MainLayoutModule as any).MainLayout || (({ children }: any) => <div>{children}</div>);
const ProtectedRoute = (ProtectedRouteModule as any).default || (ProtectedRouteModule as any).ProtectedRoute || (({ children }: any) => children);
const LoginPage = (LoginModule as any).default || (LoginModule as any).LoginPage;
const RegisterPage = (RegisterModule as any).default || (RegisterModule as any).RegisterPage;
const DashboardPage = (DashboardModule as any).default || (DashboardModule as any).DashboardPage;
const BudgetsPage = (BudgetsModule as any).default || (BudgetsModule as any).BudgetsPage;
const TransactionsPage = (TransactionsModule as any).default || (TransactionsModule as any).TransactionsPage;

export default function App() {
  const auth = useAppSelector((state) => state?.auth) || { isAuthenticated: false, loading: false };
  const { isAuthenticated, loading } = auth;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white">
        <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/login" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : (LoginPage ? <LoginPage /> : <div>Page Connexion</div>)} />
      <Route path="/register" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : (RegisterPage ? <RegisterPage /> : <div>Page Inscription</div>)} />
      
      <Route path="/" element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={DashboardPage ? <DashboardPage /> : <div>Dashboard</div>} />
        <Route path="budgets" element={BudgetsPage ? <BudgetsPage /> : <div>Budgets</div>} />
        <Route path="transactions" element={TransactionsPage ? <TransactionsPage /> : <div>Transactions</div>} />
      </Route>

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
