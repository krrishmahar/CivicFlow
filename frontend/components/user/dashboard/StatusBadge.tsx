import { cn } from "@/lib/utils";

type Status = "open" | "in-progress" | "solved";

interface StatusBadgeProps {
  status: Status;
  className?: string;
}

const StatusBadge = ({ status, className }: StatusBadgeProps) => {
  const variants: Record<Status, { label: string; classes: string }> = {
    open: {
      label: "Open",
      classes: "bg-status-open-bg text-status-open-foreground border-status-open/20",
    },
    "in-progress": {
      label: "In Progress",
      classes: "bg-status-progress-bg text-status-progress-foreground border-status-progress/20",
    },
    solved: {
      label: "Solved",
      classes: "bg-status-solved-bg text-status-solved-foreground border-status-solved/20",
    },
  };

  const { label, classes } = variants[status];

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors",
        classes,
        className
      )}
    >
      <span
        className={cn(
          "mr-1.5 h-1.5 w-1.5 rounded-full",
          status === "open" && "bg-status-open",
          status === "in-progress" && "bg-status-progress",
          status === "solved" && "bg-status-solved"
        )}
      />
      {label}
    </span>
  );
};

export default StatusBadge;
