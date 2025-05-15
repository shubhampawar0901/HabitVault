import { toast } from 'react-hot-toast';
import type { ReactNode } from 'react';

/**
 * Toast utility functions
 */
export const showToast = {
  success: (message: string) => {
    toast.success(message);
  },

  error: (message: string) => {
    toast.error(message);
  },

  loading: (message: string) => {
    return toast.loading(message);
  },

  custom: (message: string | ReactNode, options?: { className?: string }) => {
    if (typeof message === 'string') {
      toast(message, options);
    } else {
      toast(() => <div>{message}</div>, options);
    }
  },

  dismiss: (toastId?: string) => {
    if (toastId) {
      toast.dismiss(toastId);
    } else {
      toast.dismiss();
    }
  },
};
