import React, { createContext, useContext, useMemo } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  user: { name: string; role: string } | null;
}

export const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  user: null,
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const value = useMemo(
    () => ({
      isAuthenticated: false,
      user: null,
    }),
    []
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export function useAuth() {
  return useContext(AuthContext);
}
