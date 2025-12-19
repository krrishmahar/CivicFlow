import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  variant: "open" | "solved";
  className?: string;
}

const StatCard = ({ title, value, icon: Icon, variant, className }: StatCardProps) => {
  const variants = {
    open: {
      iconBg: "bg-status-open-bg",
      iconColor: "text-status-open",
      valueColor: "text-status-open-foreground",
    },
    solved: {
      iconBg: "bg-status-solved-bg",
      iconColor: "text-status-solved",
      valueColor: "text-status-solved-foreground",
    },
  };

  const styles = variants[variant];

  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-2xl bg-card p-6 shadow-card transition-all duration-300 hover:shadow-card-hover hover:-translate-y-0.5",
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-3">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className={cn("text-4xl font-bold tracking-tight", styles.valueColor)}>
            {value}
          </p>
        </div>
        <div
          className={cn(
            "flex h-12 w-12 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110",
            styles.iconBg
          )}
        >
          <Icon className={cn("h-6 w-6", styles.iconColor)} />
        </div>
      </div>
      
      {/* Decorative gradient */}
      <div
        className={cn(
          "absolute -bottom-8 -right-8 h-24 w-24 rounded-full opacity-10 blur-2xl transition-opacity duration-300 group-hover:opacity-20",
          variant === "open" ? "bg-status-open" : "bg-status-solved"
        )}
      />
    </div>
  );
};

export default StatCard;
