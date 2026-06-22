import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from "react";

export interface AuthUser {
  id?: string;
  _id?: string;
  name: string;
  email: string;
}

interface StoredAuth {
  user: AuthUser;
  token: string;
  expiresAt: number;
}

interface AuthContextValue {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  ready: boolean;
  login: (user: AuthUser, token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const STORAGE_KEY = "auth";
const EXPIRY_MS = 2 * 60 * 60 * 1000; // 2 hours

function readStored(): StoredAuth | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as StoredAuth;
    if (!parsed?.expiresAt || Date.now() > parsed.expiresAt) {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem("token");
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [auth, setAuth] = useState<StoredAuth | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setAuth(readStored());
    setReady(true);
  }, []);

  const login = useCallback((user: AuthUser, token: string) => {
    const payload: StoredAuth = { user, token, expiresAt: Date.now() + EXPIRY_MS };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    localStorage.setItem("token", token);
    setAuth(payload);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem("token");
    setAuth(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user: auth?.user ?? null,
        token: auth?.token ?? null,
        isAuthenticated: !!auth,
        ready,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
