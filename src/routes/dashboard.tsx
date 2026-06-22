import { createFileRoute, Link } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { Plus, Briefcase, Search, Loader2 } from "lucide-react";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { OpportunityCard } from "@/components/OpportunityCard";
import api from "@/lib/api";
import { toast } from "sonner";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [{ title: "Dashboard — PipelineCRM" }],
  }),
  component: () => (
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  ),
});

function Dashboard() {
  const [opportunities, setOpportunities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");

  const fetchOpportunities = useCallback(async () => {
    try {
      const { data } = await api.get("/api/opportunities");
      setOpportunities(data);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to load opportunities");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOpportunities();
  }, [fetchOpportunities]);

  const filtered = opportunities.filter((o) =>
    [o.customerName, o.requirement].some((v) =>
      v?.toLowerCase().includes(query.toLowerCase()),
    ),
  );

  const handleDelete = async (opp: any) => {
    const id = opp._id ?? opp.id;
    try {
      await api.delete(`/api/opportunities/${id}`);
      setOpportunities((prev) => prev.filter((o) => (o._id ?? o.id) !== id));
      toast.success(`Deleted "${opp.customerName}"`);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to delete opportunity");
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Opportunities</h1>
          <p className="text-sm text-muted-foreground">
            Track and manage your sales pipeline
          </p>
        </div>
        <Button asChild>
          <Link to="/opportunities/new">
            <Plus className="mr-1.5 h-4 w-4" />
            New opportunity
          </Link>
        </Button>
      </div>

      {opportunities.length > 0 && (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative max-w-sm flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by customer or requirement"
              className="pl-9 transition-shadow focus-visible:shadow-md"
            />
          </div>
          <p className="text-sm text-muted-foreground">
            {filtered.length} of {opportunities.length} opportunit{opportunities.length === 1 ? "y" : "ies"}
          </p>
        </div>
      )}

      {opportunities.length === 0 ? (
        <EmptyState />
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-background py-16 text-center">
          <Search className="h-8 w-8 text-muted-foreground" />
          <h2 className="mt-4 text-lg font-semibold">No matches found</h2>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Try a different search term for customer or requirement.
          </p>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((o) => (
            <OpportunityCard key={o._id ?? o.id} opportunity={o} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-background py-20 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-muted">
        <Briefcase className="h-7 w-7 text-muted-foreground" />
      </div>
      <h2 className="mt-5 text-lg font-semibold">No opportunities yet</h2>
      <p className="mt-1.5 max-w-sm text-sm text-muted-foreground">
        Create your first opportunity to start tracking deals through your pipeline.
      </p>
      <Button asChild className="mt-6">
        <Link to="/opportunities/new">
          <Plus className="mr-1.5 h-4 w-4" />
          Create opportunity
        </Link>
      </Button>
    </div>
  );
}
