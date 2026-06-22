import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const STAGE_STYLES = {
  New: "bg-slate-100 text-slate-700 ring-1 ring-inset ring-slate-200",
  Contacted: "bg-blue-100 text-blue-800 ring-1 ring-inset ring-blue-200",
  Qualified: "bg-indigo-100 text-indigo-800 ring-1 ring-inset ring-indigo-200",
  "Proposal Sent": "bg-amber-100 text-amber-900 ring-1 ring-inset ring-amber-200",
  Won: "bg-emerald-100 text-emerald-800 ring-1 ring-inset ring-emerald-200",
  Lost: "bg-rose-100 text-rose-800 ring-1 ring-inset ring-rose-200",
};

const PRIORITY_STYLES = {
  Low: "bg-slate-100 text-slate-700 ring-1 ring-inset ring-slate-200",
  Medium: "bg-amber-100 text-amber-900 ring-1 ring-inset ring-amber-200",
  High: "bg-rose-100 text-rose-800 ring-1 ring-inset ring-rose-200",
};

export const STAGES = ["New", "Contacted", "Qualified", "Proposal Sent", "Won", "Lost"];
export const PRIORITIES = ["Low", "Medium", "High"];

export function StageBadge({ stage }) {
  return (
    <Badge
      variant="outline"
      className={cn(
        "w-fit border-transparent px-2 py-0.5 text-xs font-medium",
        STAGE_STYLES[stage] ?? STAGE_STYLES.New,
      )}
    >
      {stage ?? "New"}
    </Badge>
  );
}

export function PriorityBadge({ priority }) {
  return (
    <Badge
      variant="outline"
      className={cn(
        "border-transparent px-2 py-0.5 text-xs font-medium",
        PRIORITY_STYLES[priority] ?? PRIORITY_STYLES.Medium,
      )}
    >
      {priority ?? "Medium"} priority
    </Badge>
  );
}
