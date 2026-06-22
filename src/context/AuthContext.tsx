import { createContext, useContext, useEffect, useState, useCallback } from "react";

const AuthContext = createContext(null);

const STORAGE_KEY = "auth";
const EXPIRY_MS = 2 * 60 * 60 * 1000; // 2 hours

function readStored() {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
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

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setAuth(readStored());
    setReady(true);
  }, []);

  const login = useCallback((user, token) => {
    const payload = { user, token, expiresAt: Date.now() + EXPIRY_MS };
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

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
