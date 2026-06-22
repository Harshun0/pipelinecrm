import { Link } from "@tanstack/react-router";
import { Pencil, Trash2, Calendar, User, DollarSign } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StageBadge, PriorityBadge } from "@/components/StatusBadges";
import { useAuth } from "@/context/AuthContext";

function formatCurrency(value) {
  if (value == null || value === "") return "—";
  const n = Number(value);
  if (Number.isNaN(n)) return String(value);
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);
}

function formatDate(d) {
  if (!d) return "—";
  try {
    return new Date(d).toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return String(d);
  }
}

export function OpportunityCard({ opportunity, onDelete }) {
  const { user } = useAuth();
  const ownerId = opportunity.createdBy?._id ?? opportunity.createdBy?.id ?? opportunity.createdBy;
  const ownerName = opportunity.createdBy?.name ?? "Unknown";
  const currentUserId = user?._id ?? user?.id;
  const isOwner = ownerId && currentUserId && String(ownerId) === String(currentUserId);
  const oppId = opportunity._id ?? opportunity.id;

  return (
    <Card className="group flex h-full flex-col overflow-hidden border-border/60 transition-all hover:-translate-y-0.5 hover:shadow-lg">
      <CardHeader className="space-y-3 pb-3">
        <div className="flex items-start justify-between gap-2">
          <h3 className="line-clamp-1 text-base font-semibold tracking-tight">
            {opportunity.customerName}
          </h3>
          <PriorityBadge priority={opportunity.priority} />
        </div>
        <StageBadge stage={opportunity.stage} />
      </CardHeader>

      <CardContent className="flex-1 space-y-3 pb-3 text-sm">
        <p className="line-clamp-2 text-muted-foreground">{opportunity.requirement}</p>

        <div className="space-y-1.5 border-t border-border/60 pt-3 text-sm">
          <div className="flex items-center gap-2 text-foreground">
            <DollarSign className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="font-medium">{formatCurrency(opportunity.estimatedValue)}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="h-3.5 w-3.5" />
            <span>Follow-up: {formatDate(opportunity.nextFollowUpDate)}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <User className="h-3.5 w-3.5" />
            <span className="truncate">
              {ownerName} · {formatDate(opportunity.createdAt)}
            </span>
          </div>
        </div>
      </CardContent>

      {isOwner && (
        <CardFooter className="gap-2 border-t border-border/60 bg-muted/30 py-3">
          <Button asChild variant="ghost" size="sm" className="flex-1">
            <Link to="/opportunities/$id/edit" params={{ id: String(oppId) }}>
              <Pencil className="mr-1.5 h-3.5 w-3.5" />
              Edit
            </Link>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="flex-1 text-destructive hover:bg-destructive/10 hover:text-destructive"
            onClick={() => onDelete?.(opportunity)}
          >
            <Trash2 className="mr-1.5 h-3.5 w-3.5" />
            Delete
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
