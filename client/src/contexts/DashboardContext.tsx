import React, { createContext, useContext, type ReactNode } from 'react';

interface DashboardContextType {
  refreshDashboard: () => Promise<void>;
}

// Create context with a default no-op function
const DashboardContext = createContext<DashboardContextType>({
  refreshDashboard: async () => {},
});

// Provider component
interface DashboardProviderProps {
  children: ReactNode;
  refreshFunction: () => Promise<void>;
}

export const DashboardProvider: React.FC<DashboardProviderProps> = ({ 
  children, 
  refreshFunction 
}) => {
  return (
    <DashboardContext.Provider value={{ refreshDashboard: refreshFunction }}>
      {children}
    </DashboardContext.Provider>
  );
};

// Hook to use the dashboard context
export const useDashboardContext = () => useContext(DashboardContext);
