import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, CheckCircle, Star, Users, Medal, Clock, Gavel } from "lucide-react";
import { useAuth } from "@/components/auth-context";
import { ComplaintCard } from "@/components/complaint-card";
import { ComplaintForm } from "@/components/complaint-form";

export default function Dashboard() {
  const { user } = useAuth();

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["/api/stats", user?.flatId],
    queryFn: async () => {
      const response = await fetch(`/api/stats?flatId=${user?.flatId}`);
      return response.json();
    },
    enabled: !!user?.flatId,
  });

  const { data: complaints, isLoading: complaintsLoading } = useQuery({
    queryKey: ["/api/complaints", user?.flatId],
    queryFn: async () => {
      const response = await fetch(`/api/complaints?flatId=${user?.flatId}`);
      return response.json();
    },
    enabled: !!user?.flatId,
  });

  if (statsLoading || complaintsLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">Loading...</div>
        </div>
      </div>
    );
  }

  const recentComplaints = complaints?.slice(0, 2) || [];

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold mb-2">Welcome back, {user?.username}!</h2>
              <p className="text-blue-100 text-lg">
                Your flat has {stats?.activeComplaints || 0} active complaints and {stats?.resolvedComplaints || 0} resolved issues.
              </p>
            </div>
            <div className="hidden md:block">
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-6 text-center">
                <Medal className="w-12 h-12 text-yellow-300 mx-auto mb-2" />
                <p className="text-sm font-medium">Your Rank</p>
                <p className="text-xs text-blue-100">#{user?.karma || 0} karma</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Complaints</p>
                <p className="text-2xl font-bold text-primary">{stats?.activeComplaints || 0}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-warning" />
            </div>
          </Card>
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Resolved Issues</p>
                <p className="text-2xl font-bold text-accent">{stats?.resolvedComplaints || 0}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-accent" />
            </div>
          </Card>
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Your Karma</p>
                <p className="text-2xl font-bold text-secondary">{user?.karma || 0}</p>
              </div>
              <Star className="w-8 h-8 text-secondary" />
            </div>
          </Card>
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Flatmates</p>
                <p className="text-2xl font-bold text-primary">{stats?.totalFlatmates || 0}</p>
              </div>
              <Users className="w-8 h-8 text-primary" />
            </div>
          </Card>
        </div>

        {/* Problem of the Week */}
        {stats?.problemOfWeek && (
          <Card className="mb-8 border-warning border-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Medal className="w-5 h-5 text-warning" />
                Flatmate Problem of the Week
                <Badge className="bg-warning text-white">
                  {stats.problemOfWeek.upvotes} votes
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-red-50 border-l-4 border-warning p-4 rounded-r-lg">
                <h4 className="font-medium text-gray-800 mb-2">{stats.problemOfWeek.title}</h4>
                <p className="text-gray-600 text-sm mb-3">{stats.problemOfWeek.description}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <Badge className="bg-red-100 text-red-800">{stats.problemOfWeek.severity}</Badge>
                    <Badge className="bg-blue-100 text-blue-800">{stats.problemOfWeek.type}</Badge>
                  </div>
                  {stats.problemOfWeek.punishment && (
                    <div className="flex items-center space-x-2 bg-warning text-white px-4 py-2 rounded-lg">
                      <Gavel className="w-4 h-4" />
                      <span className="text-sm font-medium">Punishment Activated</span>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Recent Complaints */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Recent Complaints</h2>
            <ComplaintForm />
          </div>
          
          {recentComplaints.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {recentComplaints.map((complaint) => (
                <ComplaintCard key={complaint.id} complaint={complaint} />
              ))}
            </div>
          ) : (
            <Card className="p-8 text-center">
              <p className="text-gray-500">No complaints yet. Enjoying the peace? 🎉</p>
            </Card>
          )}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6 text-center">
            <Clock className="w-12 h-12 text-primary mx-auto mb-3" />
            <h3 className="text-lg font-semibold mb-2">Response Time</h3>
            <p className="text-gray-600">Average 2.3 days</p>
          </Card>
          <Card className="p-6 text-center">
            <CheckCircle className="w-12 h-12 text-accent mx-auto mb-3" />
            <h3 className="text-lg font-semibold mb-2">Resolution Rate</h3>
            <p className="text-gray-600">85% success rate</p>
          </Card>
          <Card className="p-6 text-center">
            <Star className="w-12 h-12 text-secondary mx-auto mb-3" />
            <h3 className="text-lg font-semibold mb-2">Harmony Score</h3>
            <p className="text-gray-600">Great vibes! 🌟</p>
          </Card>
        </div>
      </div>
    </div>
  );
}
