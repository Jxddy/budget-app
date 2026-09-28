import React from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { useAppSelector } from './hooks/useRedux';

import MainLayoutDefault, * as MainLayoutModule from './components/layout/MainLayout';
import ProtectedRouteDefault, * as ProtectedRouteModule from './components/auth/ProtectedRoute';
import LoginPageDefault, * as LoginModule from './pages/LoginPage';
import RegisterPageDefault, * as RegisterModule from './pages/RegisterPage';
import DashboardPageDefault, * as DashboardModule from './pages/DashboardPage';
import BudgetsPageDefault, * as BudgetsModule from './pages/BudgetsPage';
import TransactionsPageDefault, * as TransactionsModule from './pages/TransactionsPage';

const MainLayout = MainLayoutDefault || (MainLayoutModule as any).MainLayout || (({ children }: any) => <div>{children || <Outlet />}</div>);
const ProtectedRoute = ProtectedRouteDefault || (ProtectedRouteModule as any).ProtectedRoute || (({ children }: any) => children || <Outlet />);
const LoginPage = LoginPageDefault || (LoginModule as any).LoginPage;
const RegisterPage = RegisterPageDefault || (RegisterModule as any).RegisterPage;
const DashboardPage = DashboardPageDefault || (DashboardModule as any).DashboardPage;
const BudgetsPage = BudgetsPageDefault || (BudgetsModule as any).BudgetsPage;
const TransactionsPage = TransactionsPageDefault || (TransactionsModule as any).TransactionsPage;

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
      <Route path="/login" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : (LoginPage ? <LoginPage /> : <div>Connexion</div>)} />
      <Route path="/register" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : (RegisterPage ? <RegisterPage /> : <div>Inscription</div>)} />
      
      {/* Pages avec MainLayout */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <MainLayout>
              <Outlet />
            </MainLayout>
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={DashboardPage ? <DashboardPage /> : <div className="p-8">Tableau de bord</div>} />
        <Route path="budgets" element={BudgetsPage ? <BudgetsPage /> : <div className="p-8">Budgets</div>} />
        <Route path="transactions" element={TransactionsPage ? <TransactionsPage /> : <div className="p-8">Transactions</div>} />
      </Route>

      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}
