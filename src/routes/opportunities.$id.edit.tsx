import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowLeft, Loader2, Lock } from "lucide-react";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { OpportunityForm } from "@/components/OpportunityForm";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/api";
import { isOpportunityOwner } from "@/lib/opportunity";
import { toast } from "sonner";

export const Route = createFileRoute("/opportunities/$id/edit")({
  head: () => ({
    meta: [{ title: "Edit opportunity — PipelineCRM" }],
  }),
  component: () => (
    <ProtectedRoute>
      <EditOpportunity />
    </ProtectedRoute>
  ),
});

function EditOpportunity() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [initialValues, setInitialValues] = useState<any>(null);

  const canEdit = isOpportunityOwner(user, initialValues);

  useEffect(() => {
    async function loadOpportunity() {
      try {
        const { data } = await api.get(`/api/opportunities/${id}`);
        setInitialValues(data);
      } catch (err: any) {
        toast.error(err.response?.data?.message || "Failed to load opportunity");
        navigate({ to: "/dashboard" });
      } finally {
        setLoading(false);
      }
    }
    loadOpportunity();
  }, [id, navigate]);

  const handleSubmit = async (values: any) => {
    if (!canEdit) {
      toast.error("Only the creator can update this opportunity");
      return;
    }
    setSubmitting(true);
    try {
      await api.put(`/api/opportunities/${id}`, values);
      toast.success("Opportunity updated");
      navigate({ to: "/dashboard" });
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to update opportunity");
    } finally {
      setSubmitting(false);
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
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <Button asChild variant="ghost" size="sm" className="-ml-2 mb-2">
          <Link to="/dashboard">
            <ArrowLeft className="mr-1 h-4 w-4" />
            Back
          </Link>
        </Button>
        <h1 className="text-2xl font-semibold tracking-tight">
          {canEdit ? "Edit opportunity" : "View opportunity"}
        </h1>
        <p className="text-sm text-muted-foreground">
          {canEdit
            ? initialValues?.customerName || "Update opportunity details"
            : "You can view this opportunity but only the creator can make changes"}
        </p>
      </div>
      {!canEdit && (
        <div className="flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          <Lock className="h-4 w-4 shrink-0" />
          <span>
            Created by{" "}
            <strong>{initialValues?.owner?.name ?? "another user"}</strong>. Editing is restricted
            to the owner.
          </span>
        </div>
      )}
      <Card className="border-border/60">
        <CardContent className="pt-6">
          <OpportunityForm
            initialValues={initialValues}
            onSubmit={handleSubmit}
            submitting={submitting}
            submitLabel="Save changes"
            readOnly={!canEdit}
          />
        </CardContent>
      </Card>
    </div>
  );
}
