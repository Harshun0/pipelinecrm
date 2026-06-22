import { Navigate } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Navbar } from "@/components/Navbar";

export function ProtectedRoute({ children }) {
  const { isAuthenticated, ready } = useAuth();

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="min-h-screen bg-muted/20">
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">{children}</main>
    </div>
  );
}
