import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from './useRedux';
import { addToast, removeToast } from '../store/slices/uiSlice';

type ToastType = 'success' | 'error' | 'info' | 'warning';

export const useToast = () => {
  const dispatch = useAppDispatch();
  const toasts = useAppSelector((state) => state.ui.toasts);

  const showToast = (message: string, type: ToastType = 'info') => {
    dispatch(addToast({ message, type }));
  };

  const success = (message: string) => showToast(message, 'success');
  const error = (message: string) => showToast(message, 'error');
  const info = (message: string) => showToast(message, 'info');
  const warning = (message: string) => showToast(message, 'warning');

  // Auto-remove toasts after 5 seconds
  useEffect(() => {
    toasts.forEach((toast) => {
      const timer = setTimeout(() => {
        dispatch(removeToast(toast.id));
      }, 5000);

      return () => clearTimeout(timer);
    });
  }, [toasts, dispatch]);

  return {
    toasts,
    showToast,
    success,
    error,
    info,
    warning,
    remove: (id: string) => dispatch(removeToast(id)),
  };
};
