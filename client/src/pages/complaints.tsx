import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/components/auth-context";
import { ComplaintCard } from "@/components/complaint-card";
import { ComplaintForm } from "@/components/complaint-form";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ComplaintWithUser } from "@shared/schema";

export default function ComplaintsPage() {
  const { user } = useAuth();

  const { data: complaints, isLoading } = useQuery({
    queryKey: ["/api/complaints", user?.flatId],
    queryFn: async () => {
      const response = await fetch(`/api/complaints?flatId=${user?.flatId}`);
      return response.json();
    },
    enabled: !!user?.flatId,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">Loading complaints...</div>
        </div>
      </div>
    );
  }

  const activeComplaints = complaints?.filter((c: ComplaintWithUser) => !c.isResolved) || [];
  const resolvedComplaints = complaints?.filter((c: ComplaintWithUser) => c.isResolved) || [];

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Complaints</h1>
            <p className="text-gray-600 mt-2">
              Manage and resolve flatmate issues together
            </p>
          </div>
          <ComplaintForm />
        </div>

        <Tabs defaultValue="active" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="active" className="flex items-center gap-2">
              Active
              <Badge variant="secondary">{activeComplaints.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="resolved" className="flex items-center gap-2">
              Resolved
              <Badge variant="secondary">{resolvedComplaints.length}</Badge>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="active">
            {activeComplaints.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {activeComplaints.map((complaint: ComplaintWithUser) => (
                  <ComplaintCard key={complaint.id} complaint={complaint} />
                ))}
              </div>
            ) : (
              <Card className="p-8 text-center">
                <CardContent className="pt-6">
                  <p className="text-gray-500 text-lg">
                    No active complaints! 🎉
                  </p>
                  <p className="text-gray-400 mt-2">
                    Your flat is living in harmony.
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="resolved">
            {resolvedComplaints.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {resolvedComplaints.map((complaint: ComplaintWithUser) => (
                  <ComplaintCard key={complaint.id} complaint={complaint} />
                ))}
              </div>
            ) : (
              <Card className="p-8 text-center">
                <CardContent className="pt-6">
                  <p className="text-gray-500 text-lg">
                    No resolved complaints yet.
                  </p>
                  <p className="text-gray-400 mt-2">
                    Start resolving issues to see them here!
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
