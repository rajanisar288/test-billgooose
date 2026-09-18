import { toast, type ToastOptions } from 'react-toastify';

export const useToast = () => {
  const showSuccess = (message: string, options?: ToastOptions) => {
    toast.success(message, options);
  };

  const showError = (message: string, _options?: ToastOptions) => {
    // Error toasts are suppressed in favor of inline field and section error messages
    console.error('Error (inline preferred, toast suppressed):', message);
  };

  const showInfo = (message: string, options?: ToastOptions) => {
    toast.info(message, options);
  };

  const showWarning = (message: string, options?: ToastOptions) => {
    toast.warning(message, options);
  };

  return { showSuccess, showError, showInfo, showWarning };
};
