import { Moon, Sun, Bell, Search, Shield } from "lucide-react";
import { useTheme } from "../ThemeProvider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function Header() {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-xl">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
            <Shield className="h-5 w-5 text-primary-foreground" />
          </div>
          <div className="hidden sm:block">
            <h1 className="text-lg font-semibold tracking-tight">
              Civic Control Center
            </h1>
            <p className="text-xs text-muted-foreground">
              Issue Management Dashboard
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 md:gap-4">
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search issues..."
              className="w-64 pl-9 bg-secondary/50 border-border/50"
            />
          </div>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] font-medium text-destructive-foreground">
                  3
                </span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Notifications</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                onClick={toggleTheme}
                className="rounded-full border-2 border-border hover:border-primary hover:bg-primary/10 transition-all duration-300"
              >
                {theme === "dark" ? (
                  <Sun className="h-5 w-5 text-warning transition-transform duration-300 hover:rotate-45" />
                ) : (
                  <Moon className="h-5 w-5 text-primary transition-transform duration-300 hover:-rotate-12" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              {theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
    </header>
  );
}
