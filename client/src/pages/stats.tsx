import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Clock, TrendingUp, CheckCircle, AlertTriangle } from "lucide-react";
import { useAuth } from "@/components/auth-context";

export default function StatsPage() {
  const { user } = useAuth();

  const { data: stats, isLoading } = useQuery({
    queryKey: ["/api/stats", user?.flatId],
    queryFn: async () => {
      const response = await fetch(`/api/stats?flatId=${user?.flatId}`);
      return response.json();
    },
    enabled: !!user?.flatId,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">Loading statistics...</div>
        </div>
      </div>
    );
  }

  const complaintTypes = stats?.complaintTypes || {};
  const totalComplaints = Object.values(complaintTypes).reduce((sum: number, count: any) => sum + count, 0);

  const typeColors = {
    Cleanliness: "bg-blue-500",
    Noise: "bg-purple-500", 
    Bills: "bg-green-500",
    Pets: "bg-pink-500",
    Other: "bg-gray-500",
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Flat Statistics</h1>
          <p className="text-gray-600 mt-2">
            Insights into your flat's complaint patterns and resolution trends
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Complaint Categories */}
          <Card>
            <CardHeader>
              <CardTitle>Top Complaint Categories</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(complaintTypes).map(([type, count]) => {
                  const percentage = totalComplaints > 0 ? (count as number / totalComplaints) * 100 : 0;
                  return (
                    <div key={type} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`w-4 h-4 rounded-full ${typeColors[type as keyof typeof typeColors]}`} />
                        <span className="text-sm font-medium">{type}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Progress value={percentage} className="w-20" />
                        <span className="text-sm text-gray-600 min-w-[2rem]">{count as number}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Resolution Timeline */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800">Kitchen cleaning schedule implemented</p>
                    <p className="text-xs text-gray-500">Resolved 2 days ago</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800">Quiet hours agreement signed</p>
                    <p className="text-xs text-gray-500">Resolved 5 days ago</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800">Internet bill payment system set up</p>
                    <p className="text-xs text-gray-500">Resolved 1 week ago</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="p-6 text-center">
            <Clock className="w-12 h-12 text-primary mx-auto mb-3" />
            <h3 className="text-2xl font-bold text-gray-800">2.3 days</h3>
            <p className="text-sm text-gray-600">Average resolution time</p>
          </Card>
          <Card className="p-6 text-center">
            <TrendingUp className="w-12 h-12 text-accent mx-auto mb-3" />
            <h3 className="text-2xl font-bold text-gray-800">85%</h3>
            <p className="text-sm text-gray-600">Resolution success rate</p>
          </Card>
          <Card className="p-6 text-center">
            <AlertTriangle className="w-12 h-12 text-secondary mx-auto mb-3" />
            <h3 className="text-2xl font-bold text-gray-800">12</h3>
            <p className="text-sm text-gray-600">Day streak without complaints</p>
          </Card>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Complaints</p>
                <p className="text-2xl font-bold text-gray-800">{totalComplaints}</p>
              </div>
              <Badge variant="secondary">{stats?.activeComplaints} active</Badge>
            </div>
          </Card>
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Resolved</p>
                <p className="text-2xl font-bold text-accent">{stats?.resolvedComplaints || 0}</p>
              </div>
              <Badge className="bg-accent text-white">
                {totalComplaints > 0 ? Math.round((stats?.resolvedComplaints / totalComplaints) * 100) : 0}%
              </Badge>
            </div>
          </Card>
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Issues</p>
                <p className="text-2xl font-bold text-primary">{stats?.activeComplaints || 0}</p>
              </div>
              <Badge variant="outline" className="text-primary">
                {stats?.activeComplaints > 0 ? "Attention needed" : "All good"}
              </Badge>
            </div>
          </Card>
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Flatmates</p>
                <p className="text-2xl font-bold text-gray-800">{stats?.totalFlatmates || 0}</p>
              </div>
              <Badge className="bg-blue-100 text-blue-800">Active</Badge>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
