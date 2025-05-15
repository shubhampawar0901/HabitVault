// This file is no longer used as we've moved to a shared AuthLayout component
// Keeping this file as a placeholder to avoid breaking imports

import { type ReactNode } from 'react';
import AuthLayout from '../../components/auth/AuthLayout';

interface LoginLayoutProps {
  children: ReactNode;
}

const LoginLayout = ({ children }: LoginLayoutProps) => {
  // Just pass through to the new AuthLayout
  return (
    <AuthLayout title="Login" subtitle="Sign in to your account" type="login">
      {children}
    </AuthLayout>
  );
};

export default LoginLayout;
