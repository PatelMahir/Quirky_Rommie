import { createContext, useContext, useState, useEffect } from "react";
import { AuthUser } from "@/lib/auth";

interface AuthContextType {
  user: AuthUser | null;
  login: (user: AuthUser) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("quirky-roomie-user");
    if (stored) {
      setUser(JSON.parse(stored));
    }
  }, []);

  const login = (user: AuthUser) => {
    setUser(user);
    localStorage.setItem("quirky-roomie-user", JSON.stringify(user));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("quirky-roomie-user");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
