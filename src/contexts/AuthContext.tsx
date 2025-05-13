
import React, { createContext, useContext, useState, useEffect } from "react";
import { User, UserRole } from "../types";
import { users } from "../services/mockData";
import { toast } from "@/hooks/use-toast";

interface AuthContextType {
  currentUser: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  hasPermission: (allowedRoles: UserRole[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check for stored user on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        setCurrentUser(user);
        setIsAuthenticated(true);
      } catch (error) {
        console.error("Failed to parse stored user", error);
        localStorage.removeItem("user");
      }
    }
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    // In a real app, this would be an API call
    // For this mock version, we'll just check against mock data
    const user = users.find((u) => u.username === username);
    
    // Simple mock authentication - in real app this would validate password
    if (user && password === "hielo123") {
      const updatedUser = { ...user, lastLogin: new Date() };
      setCurrentUser(updatedUser);
      setIsAuthenticated(true);
      localStorage.setItem("user", JSON.stringify(updatedUser));
      
      toast({
        title: "Inicio de sesión exitoso",
        description: `Bienvenido, ${user.name}`,
      });
      
      return true;
    }
    
    toast({
      title: "Error de autenticación",
      description: "Usuario o contraseña incorrectos",
      variant: "destructive",
    });
    
    return false;
  };

  const logout = () => {
    setCurrentUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem("user");
    
    toast({
      title: "Sesión cerrada",
      description: "Has cerrado sesión correctamente",
    });
  };

  const hasPermission = (allowedRoles: UserRole[]): boolean => {
    if (!currentUser) return false;
    return allowedRoles.includes(currentUser.role);
  };

  return (
    <AuthContext.Provider value={{ currentUser, login, logout, isAuthenticated, hasPermission }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
