import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { ThumbsUp, ThumbsDown, CheckCircle, Gavel } from "lucide-react";
import { ComplaintWithUser } from "@shared/schema";
import { useAuth } from "./auth-context";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface ComplaintCardProps {
  complaint: ComplaintWithUser;
}

const severityColors = {
  Mild: "bg-yellow-100 text-yellow-800",
  Annoying: "bg-orange-100 text-orange-800",
  Major: "bg-red-100 text-red-800",
  Nuclear: "bg-red-100 text-red-800",
};

const typeColors = {
  Cleanliness: "bg-blue-100 text-blue-800",
  Noise: "bg-purple-100 text-purple-800",
  Bills: "bg-green-100 text-green-800",
  Pets: "bg-pink-100 text-pink-800",
  Other: "bg-gray-100 text-gray-800",
};

export function ComplaintCard({ complaint }: ComplaintCardProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const voteMutation = useMutation({
    mutationFn: async (voteType: string) => {
      return apiRequest("POST", `/api/complaints/${complaint.id}/vote`, {
        userId: user?.id,
        voteType,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/complaints"] });
      queryClient.invalidateQueries({ queryKey: ["/api/stats"] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const resolveMutation = useMutation({
    mutationFn: async () => {
      return apiRequest("PUT", `/api/complaints/${complaint.id}/resolve`, {
        userId: user?.id,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/complaints"] });
      queryClient.invalidateQueries({ queryKey: ["/api/stats"] });
      toast({
        title: "Complaint Resolved",
        description: "You earned 50 karma points!",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const formatDate = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - new Date(date).getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    
    if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    return "Less than an hour ago";
  };

  return (
    <Card className={`p-6 ${complaint.isProblemOfWeek ? 'border-warning border-2' : ''}`}>
      <CardContent className="p-0">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="font-semibold text-gray-800">{complaint.title}</h3>
              {complaint.isProblemOfWeek && (
                <Badge className="bg-warning text-white">Problem of the Week</Badge>
              )}
            </div>
            <p className="text-gray-600 text-sm mb-3">{complaint.description}</p>
          </div>
          <Badge className={severityColors[complaint.severity as keyof typeof severityColors]}>
            {complaint.severity}
          </Badge>
        </div>

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-500">
              By {complaint.user.username} • {formatDate(complaint.createdAt!)}
            </span>
            <Badge className={typeColors[complaint.type as keyof typeof typeColors]}>
              {complaint.type}
            </Badge>
          </div>
          {!complaint.isResolved && (
            <Button
              onClick={() => resolveMutation.mutate()}
              disabled={resolveMutation.isPending}
              size="sm"
              className="bg-accent hover:bg-accent/90"
            >
              <CheckCircle className="h-4 w-4 mr-1" />
              Resolve
            </Button>
          )}
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => voteMutation.mutate("upvote")}
              disabled={voteMutation.isPending}
              className="flex items-center space-x-1 bg-green-50 text-green-700 hover:bg-green-100"
            >
              <ThumbsUp className="h-4 w-4" />
              <span>{complaint.upvotes}</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => voteMutation.mutate("downvote")}
              disabled={voteMutation.isPending}
              className="flex items-center space-x-1 bg-red-50 text-red-700 hover:bg-red-100"
            >
              <ThumbsDown className="h-4 w-4" />
              <span>{complaint.downvotes}</span>
            </Button>
          </div>
          {complaint.isResolved && (
            <Badge className="bg-accent text-white">Resolved</Badge>
          )}
        </div>

        {complaint.punishment && (
          <div className="mt-4 p-3 bg-orange-50 border border-orange-200 rounded-lg">
            <div className="flex items-center space-x-2 text-orange-800">
              <Gavel className="h-4 w-4" />
              <span className="text-sm font-medium">Punishment Generated:</span>
            </div>
            <p className="text-sm text-orange-700 mt-1">{complaint.punishment}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
