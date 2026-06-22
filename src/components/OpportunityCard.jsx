import { Link, useNavigate } from "@tanstack/react-router";
import { Pencil, Trash2, Calendar, User, DollarSign, ChevronRight } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StageBadge, PriorityBadge } from "@/components/StatusBadges";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";
import { isOpportunityOwner } from "@/lib/opportunity";

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

const PRIORITY_ACCENT = {
  Low: "group-hover:border-l-slate-400",
  Medium: "group-hover:border-l-amber-400",
  High: "group-hover:border-l-rose-400",
};

export function OpportunityCard({ opportunity, onDelete }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const owner = opportunity.owner ?? opportunity.createdBy;
  const ownerName = owner?.name ?? "Unknown";
  const isOwner = isOpportunityOwner(user, opportunity);
  const oppId = opportunity._id ?? opportunity.id;

  const openOpportunity = () => {
    if (!oppId) return;
    navigate({ to: "/opportunities/$id/edit", params: { id: String(oppId) } });
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      openOpportunity();
    }
  };

  return (
    <Card
      role="button"
      tabIndex={0}
      onClick={openOpportunity}
      onKeyDown={handleKeyDown}
      className={cn(
        "group relative flex h-full cursor-pointer flex-col overflow-hidden border-border/60 border-l-4 border-l-transparent bg-card",
        "transition-all duration-200 ease-out",
        "hover:-translate-y-1 hover:border-primary/25 hover:shadow-xl hover:shadow-primary/5",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        "active:scale-[0.99] active:shadow-md",
        PRIORITY_ACCENT[opportunity.priority] ?? PRIORITY_ACCENT.Medium,
      )}
    >
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/[0.03] to-transparent opacity-0 transition-opacity duration-200 group-hover:opacity-100" />

      <CardHeader className="relative space-y-3 pb-3">
        <div className="flex items-start justify-between gap-2">
          <h3 className="line-clamp-1 text-base font-semibold tracking-tight transition-colors group-hover:text-primary">
            {opportunity.customerName}
          </h3>
          <div className="flex shrink-0 items-center gap-1.5">
            <PriorityBadge priority={opportunity.priority} />
            <ChevronRight className="h-4 w-4 text-muted-foreground/0 transition-all duration-200 group-hover:translate-x-0.5 group-hover:text-primary" />
          </div>
        </div>
        <StageBadge stage={opportunity.stage} />
      </CardHeader>

      <CardContent className="relative flex-1 space-y-3 pb-3 text-sm">
        <p className="line-clamp-2 text-muted-foreground transition-colors group-hover:text-foreground/80">
          {opportunity.requirement}
        </p>

        <div className="space-y-1.5 border-t border-border/60 pt-3 text-sm">
          <div className="flex items-center gap-2 text-foreground">
            <DollarSign className="h-3.5 w-3.5 text-muted-foreground transition-colors group-hover:text-primary/70" />
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
        <CardFooter
          className="relative z-10 gap-2 border-t border-border/60 bg-muted/30 py-3"
          onClick={(e) => e.stopPropagation()}
        >
          <Button asChild variant="ghost" size="sm" className="flex-1 hover:bg-primary/10 hover:text-primary">
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

      {!isOwner && (
        <div className="relative border-t border-border/60 bg-muted/20 px-6 py-2.5 text-center text-xs text-muted-foreground transition-colors group-hover:bg-primary/5 group-hover:text-primary">
          Click to view details
        </div>
      )}
    </Card>
  );
}
