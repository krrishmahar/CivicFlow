import { FileText, AlertCircle, CheckCircle2, TrendingUp } from "lucide-react";
import { Header } from "@/components/dashboard/Header";
import { StatCard } from "@/components/dashboard/StatCard";
import { ProgressRing } from "@/components/dashboard/ProgressRing";
import { CategoryPieChart } from "@/components/dashboard/CategoryPieChart";
import { LatestIssuesFeed } from "@/components/dashboard/LatestIssuesFeed";
import { Issue } from "@/components/dashboard/IssueCard";
import { useToast } from "@/hooks/use-toast";

// Mock data for demonstration
const mockIssues: Issue[] = [
  {
    id: "1",
    title: "Pothole on Main Street causing traffic delays",
    location: "123 Main Street, Downtown",
    category: "roads",
    severity: "high",
    status: "open",
    reportedAt: new Date(Date.now() - 1000 * 60 * 15), // 15 mins ago
  },
  {
    id: "2",
    title: "Water pipe burst near Central Park",
    location: "Central Park Avenue, Block 5",
    category: "water",
    severity: "high",
    status: "in-progress",
    reportedAt: new Date(Date.now() - 1000 * 60 * 45), // 45 mins ago
  },
  {
    id: "3",
    title: "Street light outage on Oak Lane",
    location: "Oak Lane, Residential Area",
    category: "electricity",
    severity: "medium",
    status: "open",
    reportedAt: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
  },
  {
    id: "4",
    title: "Garbage collection missed in Sector 7",
    location: "Sector 7, Industrial Zone",
    category: "sanitation",
    severity: "low",
    status: "solved",
    reportedAt: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5 hours ago
  },
  {
    id: "5",
    title: "Broken traffic signal at Junction 12",
    location: "Junction 12, Highway Intersection",
    category: "public-safety",
    severity: "high",
    status: "in-progress",
    reportedAt: new Date(Date.now() - 1000 * 60 * 60 * 8), // 8 hours ago
  },
  {
    id: "6",
    title: "Road surface damage after heavy rain",
    location: "Riverside Drive, Near Bridge",
    category: "roads",
    severity: "medium",
    status: "open",
    reportedAt: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
  },
];

const categoryData = [
  { name: "Roads", value: 42, color: "hsl(217, 91%, 60%)" },
  { name: "Water", value: 28, color: "hsl(199, 89%, 48%)" },
  { name: "Electricity", value: 18, color: "hsl(38, 92%, 50%)" },
  { name: "Sanitation", value: 15, color: "hsl(142, 76%, 36%)" },
  { name: "Public Safety", value: 12, color: "hsl(280, 65%, 60%)" },
];

const stats = {
  total: 1247,
  open: 423,
  solved: 824,
};

const resolutionRate = (stats.solved / stats.total) * 100;

export default function Index() {
  const { toast } = useToast();

  const handleIssueClick = (issue: Issue) => {
    toast({
      title: "Issue Selected",
      description: `Opening details for: ${issue.title}`,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container px-4 py-6 md:px-6 md:py-8">
        {/* Page Title */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold tracking-tight md:text-3xl">
            Dashboard Overview
          </h2>
          <p className="text-muted-foreground mt-1">
            Real-time monitoring of civic issues across all departments
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <StatCard
            title="Total Issues"
            value={stats.total.toLocaleString()}
            subtitle="All time reports"
            icon={FileText}
            variant="info"
            trend={{ value: 12, isPositive: true }}
          />
          <StatCard
            title="Open Issues"
            value={stats.open.toLocaleString()}
            subtitle="Awaiting resolution"
            icon={AlertCircle}
            variant="destructive"
            trend={{ value: 5, isPositive: false }}
          />
          <StatCard
            title="Solved Issues"
            value={stats.solved.toLocaleString()}
            subtitle="Successfully resolved"
            icon={CheckCircle2}
            variant="success"
            trend={{ value: 18, isPositive: true }}
          />
          <StatCard
            title="Weekly Progress"
            value="+127"
            subtitle="Issues resolved this week"
            icon={TrendingUp}
            variant="warning"
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left Column - Resolution Rate & Chart */}
          <div className="space-y-6">
            <ProgressRing percentage={resolutionRate} />
            <CategoryPieChart data={categoryData} />
          </div>

          {/* Right Column - Latest Issues Feed */}
          <div className="lg:col-span-2">
            <LatestIssuesFeed
              issues={mockIssues}
              onIssueClick={handleIssueClick}
            />
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-12 pt-6 border-t border-border/50 text-center text-sm text-muted-foreground">
          <p>Civic Control Center • Real-time Issue Management System</p>
          <p className="mt-1">Last updated: {new Date().toLocaleString()}</p>
        </footer>
      </main>
    </div>
  );
}
