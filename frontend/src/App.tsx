import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from './hooks/useRedux';
import { getProfile } from './store/slices/authSlice';

// Components
import { ProtectedRoute, PublicRoute } from './components/auth/ProtectedRoute';

// Pages
import { DashboardPage } from './pages/DashboardPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { BudgetsPage } from './pages/BudgetsPage';
import { TransactionsPage } from './pages/TransactionsPage';

function App() {
  const dispatch = useAppDispatch();
  const { token } = useAppSelector((state) => state.auth);
  const { darkMode } = useAppSelector((state) => state.ui);

  // Appliquer le mode sombre
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Charger le profil utilisateur si token présent
  useEffect(() => {
    if (token) {
      dispatch(getProfile());
    }
  }, [token, dispatch]);

  return (
    <BrowserRouter>
      <Routes>
        {/* Routes publiques */}
        <Route element={<PublicRoute />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>

        {/* Routes protégées */}
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/budgets" element={<BudgetsPage />} />
          <Route path="/transactions" element={<TransactionsPage />} />
        </Route>

        {/* Redirection par défaut */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
