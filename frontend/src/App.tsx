import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store';
import { useAppSelector } from './hooks/useRedux';

// Import modules
import * as MainLayoutModule from './components/layout/MainLayout';
import * as ProtectedRouteModule from './components/auth/ProtectedRoute';
import * as LoginModule from './pages/LoginPage';
import * as RegisterModule from './pages/RegisterPage';
import * as DashboardModule from './pages/DashboardPage';
import * as BudgetsModule from './pages/BudgetsPage';
import * as TransactionsModule from './pages/TransactionsPage';

// Resolution safe
const MainLayout = (MainLayoutModule as any).default || (MainLayoutModule as any).MainLayout || (({ children }: any) => <div className="p-4">{children}</div>);
const ProtectedRoute = (ProtectedRouteModule as any).default || (ProtectedRouteModule as any).ProtectedRoute || (({ children }: any) => children);
const LoginPage = (LoginModule as any).default || (LoginModule as any).LoginPage;
const RegisterPage = (RegisterModule as any).default || (RegisterModule as any).RegisterPage;
const DashboardPage = (DashboardModule as any).default || (DashboardModule as any).DashboardPage;
const BudgetsPage = (BudgetsModule as any).default || (BudgetsModule as any).BudgetsPage;
const TransactionsPage = (TransactionsModule as any).default || (TransactionsModule as any).TransactionsPage;

function AppRoutes() {
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
      {/* Route de connexion */}
      <Route
        path="/login"
        element={
          isAuthenticated ? (
            <Navigate to="/dashboard" replace />
          ) : LoginPage ? (
            <LoginPage />
          ) : (
            <div className="p-8 text-center text-slate-800">
              <h2 className="text-xl font-bold">Connexion</h2>
              <p>Chargement du composant...</p>
            </div>
          )
        }
      />

      {/* Route d'inscription */}
      <Route
        path="/register"
        element={
          isAuthenticated ? (
            <Navigate to="/dashboard" replace />
          ) : RegisterPage ? (
            <RegisterPage />
          ) : (
            <div className="p-8 text-center">Inscription</div>
          )
        }
      />

      {/* Application principale protégée */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={DashboardPage ? <DashboardPage /> : <div className="p-6">Dashboard</div>} />
        <Route path="budgets" element={BudgetsPage ? <BudgetsPage /> : <div className="p-6">Budgets</div>} />
        <Route path="transactions" element={TransactionsPage ? <TransactionsPage /> : <div className="p-6">Transactions</div>} />
      </Route>

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Suspense fallback={<div className="p-6 text-center">Chargement...</div>}>
          <AppRoutes />
        </Suspense>
      </BrowserRouter>
    </Provider>
  );
}
