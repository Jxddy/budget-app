import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAppSelector } from '../hooks/useRedux';

export const ProtectedRoute: React.FC = () => {
  const { user, token } = useAppSelector((state) => state.auth);

  if (!user || !token) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export const PublicRoute: React.FC = () => {
  const { user, token } = useAppSelector((state) => state.auth);

  if (user && token) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};
