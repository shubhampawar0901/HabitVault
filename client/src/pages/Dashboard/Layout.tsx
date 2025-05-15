// This file is no longer used as we've implemented the dashboard directly in index.tsx
// Keeping this file as a placeholder to avoid breaking imports

import { type ReactNode } from 'react';

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  return <>{children}</>;
};

export default DashboardLayout;
