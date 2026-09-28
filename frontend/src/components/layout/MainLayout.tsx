import React from 'react';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { ToastContainer } from '../common/Toast';
import { useAppSelector } from '../../hooks/useRedux';

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const { toasts } = useAppSelector((state) => state.ui);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar fixée à gauche (largeur 256px / w-64) */}
      <Sidebar />

      {/* Contenu principal décalé de la largeur de la sidebar sur Desktop (lg:pl-64) */}
      <div className="lg:pl-64 flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 p-6 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>

      <ToastContainer toasts={toasts} />
    </div>
  );
};
