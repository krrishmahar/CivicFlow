import { Calendar, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import StatusBadge from "./StatusBadge";

type Category = "roads" | "water" | "electricity" | "garbage" | "other";
type Status = "open" | "in-progress" | "solved";

interface Issue {
  id: string;
  title: string;
  category: Category;
  status: Status;
  date: string;
}

interface IssueCardProps {
  issue: Issue;
  className?: string;
  onClick?: () => void;
}

const categoryLabels: Record<Category, string> = {
  roads: "Roads",
  water: "Water",
  electricity: "Electricity",
  garbage: "Garbage",
  other: "Other",
};

const categoryColors: Record<Category, string> = {
  roads: "bg-category-roads/10 text-category-roads",
  water: "bg-category-water/10 text-category-water",
  electricity: "bg-category-electricity/10 text-category-electricity",
  garbage: "bg-category-garbage/10 text-category-garbage",
  other: "bg-category-other/10 text-category-other",
};

const IssueCard = ({ issue, className, onClick }: IssueCardProps) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        "group w-full text-left rounded-xl bg-card p-4 shadow-card transition-all duration-300 hover:shadow-card-hover hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-primary/20",
        className
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0 space-y-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className={cn(
                "inline-flex items-center rounded-md px-2 py-1 text-xs font-medium",
                categoryColors[issue.category]
              )}
            >
              {categoryLabels[issue.category]}
            </span>
            <StatusBadge status={issue.status} />
          </div>
          
          <h3 className="font-semibold text-card-foreground line-clamp-2 group-hover:text-primary transition-colors">
            {issue.title}
          </h3>
          
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Calendar className="h-3.5 w-3.5" />
            <span>{issue.date}</span>
          </div>
        </div>
        
        <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
          <ChevronRight className="h-5 w-5 text-muted-foreground" />
        </div>
      </div>
    </button>
  );
};

export default IssueCard;
