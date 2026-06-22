import { createFileRoute, Navigate } from "@tanstack/react-router";
import { useAuth } from "@/context/AuthContext";
import { Loader2 } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "PipelineCRM — Mini opportunity tracker" },
      { name: "description", content: "Track and manage your sales opportunities in one clean pipeline." },
    ],
  }),
  component: Index,
});

function Index() {
  const { isAuthenticated, ready } = useAuth();
  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }
  return <Navigate to={isAuthenticated ? "/dashboard" : "/login"} />;
}
