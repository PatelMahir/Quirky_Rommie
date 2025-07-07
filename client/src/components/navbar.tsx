import { Link, useLocation } from "wouter";
import { useAuth } from "./auth-context";
import { Home, FileText, Trophy, BarChart3, LogOut } from "lucide-react";
import { Button } from "./ui/button";

export function Navbar() {
  const { user, logout } = useAuth();
  const [location] = useLocation();

  const navItems = [
    { path: "/", label: "Dashboard", icon: Home },
    { path: "/complaints", label: "Complaints", icon: FileText },
    { path: "/leaderboard", label: "Leaderboard", icon: Trophy },
    { path: "/stats", label: "Stats", icon: BarChart3 },
  ];

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <h1 className="text-2xl font-bold text-primary">QuirkyRoomie</h1>
            </div>
            <div className="hidden md:block ml-10">
              <div className="flex items-baseline space-x-4">
                {navItems.map((item) => {
                  const isActive = location === item.path;
                  return (
                    <Link key={item.path} href={item.path}>
                      <span
                        className={`px-3 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer ${
                          isActive
                            ? "text-primary bg-blue-50"
                            : "text-gray-600 hover:text-primary"
                        }`}
                      >
                        {item.label}
                      </span>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Trophy className="h-4 w-4 text-secondary" />
              <span className="text-sm font-medium">Karma: {user?.karma || 0}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Home className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">Flat: #{user?.flatCode}</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium">{user?.username}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={logout}
                className="text-gray-600 hover:text-red-600"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
