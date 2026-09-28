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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Header />
        <main className="p-4 lg:p-6 flex-1">
          {children}
        </main>
      </div>
      <ToastContainer toasts={toasts} />
    </div>
  );
};
