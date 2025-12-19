import { useState } from "react";
import { IssueCard, Issue } from "@/components/IssueCard";
import { EmptyState } from "@/components/EmptyState";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

// Mock data - replace with actual API call
const mockIssues: Issue[] = [
  {
    id: "1",
    title: "Pothole on Main Street near City Hall",
    category: "Roads & Infrastructure",
    status: "Open",
    dateReported: "Dec 15, 2024",
  },
  {
    id: "2",
    title: "Broken streetlight at Oak Avenue",
    category: "Public Lighting",
    status: "In Progress",
    dateReported: "Dec 10, 2024",
  },
  {
    id: "3",
    title: "Overflowing trash bin at Central Park",
    category: "Waste Management",
    status: "Solved",
    dateReported: "Dec 5, 2024",
  },
  {
    id: "4",
    title: "Graffiti on public library wall",
    category: "Public Property",
    status: "Open",
    dateReported: "Dec 1, 2024",
  },
];

const MyIssues = () => {
  const navigate = useNavigate();
  // Toggle this to see empty state: const [issues] = useState<Issue[]>([]);
  const [issues] = useState<Issue[]>(mockIssues);

  const handleIssueClick = (id: string) => {
    // Navigate to issue details page
    toast({
      title: "Opening issue details",
      description: `Navigating to issue #${id}`,
    });
    // navigate(`/issues/${id}`);
  };

  const handleReportIssue = () => {
    toast({
      title: "Report an Issue",
      description: "Navigating to issue reporting form",
    });
    // navigate("/report");
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-4 py-8 sm:py-12">
        {/* Page Header */}
        <header className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-semibold text-foreground mb-2">
            My Issues
          </h1>
          <p className="text-muted-foreground">
            Track the issues you have reported
          </p>
        </header>

        {/* Issue List or Empty State */}
        {issues.length === 0 ? (
          <EmptyState onReportIssue={handleReportIssue} />
        ) : (
          <div className="space-y-3">
            {issues.map((issue) => (
              <IssueCard
                key={issue.id}
                issue={issue}
                onClick={handleIssueClick}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyIssues;
