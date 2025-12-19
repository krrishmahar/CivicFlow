import { AlertCircle, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import StatCard from "@/components/dashboard/StatCard";
import CircularProgress from "@/components/dashboard/CircularProgress";
import IssueCard from "@/components/dashboard/IssueCard";
import CategoryPieChart from "@/components/dashboard/CategoryPieChart";

// Mock data
const mockIssues = [
  {
    id: "1",
    title: "Large pothole on Main Street causing traffic issues",
    category: "roads" as const,
    status: "open" as const,
    date: "Dec 15, 2024",
  },
  {
    id: "2",
    title: "Street light not working near Central Park",
    category: "electricity" as const,
    status: "in-progress" as const,
    date: "Dec 14, 2024",
  },
  {
    id: "3",
    title: "Water leakage from broken pipe on Oak Avenue",
    category: "water" as const,
    status: "solved" as const,
    date: "Dec 12, 2024",
  },
  {
    id: "4",
    title: "Overflowing garbage bins at market square",
    category: "garbage" as const,
    status: "open" as const,
    date: "Dec 10, 2024",
  },
  {
    id: "5",
    title: "Damaged sidewalk near elementary school",
    category: "roads" as const,
    status: "in-progress" as const,
    date: "Dec 8, 2024",
  },
  {
    id: "6",
    title: "Fallen tree blocking pedestrian path in park",
    category: "other" as const,
    status: "solved" as const,
    date: "Dec 5, 2024",
  },
];

const categoryChartData = [
  { name: "Roads", value: 8, color: "hsl(199, 89%, 48%)" },
  { name: "Water", value: 5, color: "hsl(217, 91%, 60%)" },
  { name: "Electricity", value: 4, color: "hsl(45, 93%, 47%)" },
  { name: "Garbage", value: 6, color: "hsl(152, 69%, 40%)" },
  { name: "Other", value: 2, color: "hsl(280, 67%, 55%)" },
];

const stats = {
  openIssues: 12,
  solvedIssues: 13,
  totalIssues: 25,
};

const Index = () => {
  const resolutionRate = (stats.solvedIssues / stats.totalIssues) * 100;

  const handleIssueClick = (issueId: string) => {
    toast.info("Opening issue details...", {
      description: `Navigating to issue #${issueId}`,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-6 sm:py-8">
        <DashboardHeader />

        {/* Stats Section */}
        <section className="mb-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 stagger-children">
            <StatCard
              title="Open Issues"
              value={stats.openIssues}
              icon={AlertCircle}
              variant="open"
            />
            <StatCard
              title="Solved Issues"
              value={stats.solvedIssues}
              icon={CheckCircle2}
              variant="solved"
            />
            
            {/* Resolution Rate Card */}
            <div className="sm:col-span-2 rounded-2xl bg-card p-6 shadow-card">
              <div className="flex flex-col sm:flex-row items-center gap-6">
                <CircularProgress percentage={resolutionRate} />
                <div className="text-center sm:text-left">
                  <h3 className="text-lg font-semibold text-card-foreground">
                    Resolution Rate
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1 max-w-xs">
                    Your issues are being resolved. Keep reporting to help improve our community!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Charts and Issues Section */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Pie Chart */}
          <div className="lg:col-span-1 rounded-2xl bg-card p-6 shadow-card animate-fade-up">
            <h2 className="text-lg font-semibold text-card-foreground mb-4">
              Issues by Category
            </h2>
            <CategoryPieChart data={categoryChartData} />
          </div>

          {/* Latest Issues */}
          <div className="lg:col-span-2 rounded-2xl bg-card p-6 shadow-card animate-fade-up" style={{ animationDelay: "100ms" }}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-card-foreground">
                Latest Issues
              </h2>
              <button className="text-sm font-medium text-primary hover:text-primary/80 transition-colors">
                View all
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 stagger-children">
              {mockIssues.map((issue) => (
                <IssueCard
                  key={issue.id}
                  issue={issue}
                  onClick={() => handleIssueClick(issue.id)}
                />
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Index;
