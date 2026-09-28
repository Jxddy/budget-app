import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAppSelector } from './hooks/useRedux';

// Layout & Protected Route
import * as MainLayoutModule from './components/layout/MainLayout';
import * as ProtectedRouteModule from './components/auth/ProtectedRoute';

// Pages
import * as LoginModule from './pages/LoginPage';
import * as RegisterModule from './pages/RegisterPage';
import * as DashboardModule from './pages/DashboardPage';
import * as BudgetsModule from './pages/BudgetsPage';
import * as TransactionsModule from './pages/TransactionsPage';

// Common
import * as ToastModule from './components/common/Toast';

// Résolution universelle (compatible export default ET export nommé)
const MainLayout = (MainLayoutModule as any).default || (MainLayoutModule as any).MainLayout;
const ProtectedRoute = (ProtectedRouteModule as any).default || (ProtectedRouteModule as any).ProtectedRoute;
const LoginPage = (LoginModule as any).default || (LoginModule as any).LoginPage;
const RegisterPage = (RegisterModule as any).default || (RegisterModule as any).RegisterPage;
const DashboardPage = (DashboardModule as any).default || (DashboardModule as any).DashboardPage;
const BudgetsPage = (BudgetsModule as any).default || (BudgetsModule as any).BudgetsPage;
const TransactionsPage = (TransactionsModule as any).default || (TransactionsModule as any).TransactionsPage;
const Toast = (ToastModule as any).default || (ToastModule as any).Toast;

export default function App() {
  const { isAuthenticated, loading } = useAppSelector((state) => state.auth);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        {/* Routes publiques */}
        <Route
          path="/login"
          element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <LoginPage />}
        />
        <Route
          path="/register"
          element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <RegisterPage />}
        />

        {/* Routes protégées */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="budgets" element={<BudgetsPage />} />
          <Route path="transactions" element={<TransactionsPage />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      {Toast && <Toast />}
    </BrowserRouter>
  );
}
