import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { OpportunityForm } from "@/components/OpportunityForm";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import api from "@/lib/api";
import { toast } from "sonner";

export const Route = createFileRoute("/opportunities/new")({
  head: () => ({
    meta: [{ title: "New opportunity — PipelineCRM" }],
  }),
  component: () => (
    <ProtectedRoute>
      <NewOpportunity />
    </ProtectedRoute>
  ),
});

function NewOpportunity() {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (values: any) => {
    setSubmitting(true);
    try {
      await api.post("/api/opportunities", values);
      toast.success("Opportunity created");
      navigate({ to: "/dashboard" });
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to create opportunity");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <Button asChild variant="ghost" size="sm" className="-ml-2 mb-2">
          <Link to="/dashboard">
            <ArrowLeft className="mr-1 h-4 w-4" />
            Back
          </Link>
        </Button>
        <h1 className="text-2xl font-semibold tracking-tight">New opportunity</h1>
        <p className="text-sm text-muted-foreground">
          Capture customer details and pipeline status
        </p>
      </div>
      <Card className="border-border/60">
        <CardContent className="pt-6">
          <OpportunityForm
            initialValues={null}
            onSubmit={handleSubmit}
            submitting={submitting}
            submitLabel="Create opportunity"
          />
        </CardContent>
      </Card>
    </div>
  );
}
