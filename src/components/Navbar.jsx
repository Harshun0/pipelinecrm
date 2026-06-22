import { Link, useNavigate } from "@tanstack/react-router";
import { LogOut, Briefcase } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success("Signed out");
    navigate({ to: "/login" });
  };

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link to="/dashboard" className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Briefcase className="h-5 w-5" />
          </span>
          <span className="text-lg font-semibold tracking-tight">PipelineCRM</span>
        </Link>

        {isAuthenticated && (
          <div className="flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-medium leading-tight">{user?.name}</p>
              <p className="text-xs text-muted-foreground">{user?.email}</p>
            </div>
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary text-sm font-semibold text-secondary-foreground">
              {user?.name?.[0]?.toUpperCase() ?? "U"}
            </div>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="mr-1.5 h-4 w-4" />
              Logout
            </Button>
          </div>
        )}
      </div>
    </header>
  );
}
