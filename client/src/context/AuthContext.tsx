import { createContext, useState, ReactNode } from "react";

// Define the shape of the context
interface AuthContextProps {
  isAuthenticated: boolean;
  login: () => void;
  logout: () => void;
}

// Create the context with default values
export const AuthContext = createContext<AuthContextProps>({
  isAuthenticated: false,
  login: () => {},
  logout: () => {},
});

// Create a context provider component
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  // Functions to update the authentication state
  const login = () => setIsAuthenticated(true);
  const logout = () => setIsAuthenticated(false);

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
