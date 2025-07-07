import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/components/auth-context";
import { Navbar } from "@/components/navbar";
import AuthPage from "@/pages/auth";
import Dashboard from "@/pages/dashboard";
import ComplaintsPage from "@/pages/complaints";
import LeaderboardPage from "@/pages/leaderboard";
import StatsPage from "@/pages/stats";
import NotFound from "@/pages/not-found";

function AppContent() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <AuthPage />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <Switch>
        <Route path="/" component={Dashboard} />
        <Route path="/complaints" component={ComplaintsPage} />
        <Route path="/leaderboard" component={LeaderboardPage} />
        <Route path="/stats" component={StatsPage} />
        <Route component={NotFound} />
      </Switch>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <AppContent />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
