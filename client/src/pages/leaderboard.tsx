import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Crown, Medal, Trophy, Star } from "lucide-react";
import { useAuth } from "@/components/auth-context";
import { User } from "@shared/schema";

export default function LeaderboardPage() {
  const { user } = useAuth();

  const { data: leaderboard, isLoading } = useQuery({
    queryKey: ["/api/leaderboard", user?.flatId],
    queryFn: async () => {
      const response = await fetch(`/api/leaderboard?flatId=${user?.flatId}`);
      return response.json();
    },
    enabled: !!user?.flatId,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">Loading leaderboard...</div>
        </div>
      </div>
    );
  }

  const top3 = leaderboard?.slice(0, 3) || [];
  const rest = leaderboard?.slice(3) || [];

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Karma Leaderboard</h1>
            <p className="text-gray-600 mt-2">
              Recognition for flatmates who make a difference
            </p>
          </div>
          <div className="bg-secondary text-white px-4 py-2 rounded-lg font-medium">
            <Trophy className="w-4 h-4 inline mr-2" />
            Monthly Reset in 12 days
          </div>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-center">Top Performers</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Podium */}
            <div className="flex items-end justify-center space-x-8 mb-8">
              {/* 2nd Place */}
              {top3[1] && (
                <div className="text-center">
                  <div className="bg-gray-200 rounded-full w-16 h-16 flex items-center justify-center mb-4">
                    <Medal className="w-8 h-8 text-gray-600" />
                  </div>
                  <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full mx-auto mb-2 flex items-center justify-center">
                    <span className="text-lg font-bold text-gray-700">
                      {top3[1].username.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <h3 className="font-semibold text-gray-800">{top3[1].username}</h3>
                  <p className="text-sm text-gray-600">{top3[1].karma} karma</p>
                  <Badge className="bg-gray-100 text-gray-700 mt-2">#2</Badge>
                </div>
              )}

              {/* 1st Place */}
              {top3[0] && (
                <div className="text-center">
                  <div className="bg-yellow-200 rounded-full w-20 h-20 flex items-center justify-center mb-4">
                    <Crown className="w-10 h-10 text-yellow-600" />
                  </div>
                  <div className="w-20 h-20 bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-full mx-auto mb-2 flex items-center justify-center">
                    <span className="text-xl font-bold text-yellow-700">
                      {top3[0].username.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <h3 className="font-semibold text-gray-800">{top3[0].username}</h3>
                  <p className="text-sm text-gray-600">{top3[0].karma} karma</p>
                  <Badge className="bg-yellow-100 text-yellow-700 mt-2">#1</Badge>
                </div>
              )}

              {/* 3rd Place */}
              {top3[2] && (
                <div className="text-center">
                  <div className="bg-orange-200 rounded-full w-16 h-16 flex items-center justify-center mb-4">
                    <Medal className="w-8 h-8 text-orange-600" />
                  </div>
                  <div className="w-16 h-16 bg-gradient-to-br from-orange-100 to-orange-200 rounded-full mx-auto mb-2 flex items-center justify-center">
                    <span className="text-lg font-bold text-orange-700">
                      {top3[2].username.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <h3 className="font-semibold text-gray-800">{top3[2].username}</h3>
                  <p className="text-sm text-gray-600">{top3[2].karma} karma</p>
                  <Badge className="bg-orange-100 text-orange-700 mt-2">#3</Badge>
                </div>
              )}
            </div>

            {/* Full Leaderboard */}
            <div className="space-y-3">
              {leaderboard?.map((member: User, index: number) => (
                <div
                  key={member.id}
                  className={`flex items-center justify-between p-4 rounded-lg ${
                    member.id === user?.id ? "bg-blue-50 border-2 border-blue-200" : "bg-gray-50"
                  }`}
                >
                  <div className="flex items-center space-x-4">
                    <span className="font-bold text-lg text-gray-600">#{index + 1}</span>
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center">
                      <span className="font-bold text-blue-700">
                        {member.username.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800">
                        {member.username}
                        {member.id === user?.id && (
                          <span className="text-primary text-sm ml-2">(You)</span>
                        )}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {member.isBestFlatmate ? "🏆 Best Flatmate" : `Karma earned: ${member.karma}`}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-lg text-primary">{member.karma}</p>
                    <p className="text-sm text-gray-600">karma</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Achievement Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6 text-center">
            <Star className="w-12 h-12 text-secondary mx-auto mb-3" />
            <h3 className="text-lg font-semibold mb-2">Karma System</h3>
            <p className="text-sm text-gray-600">
              Earn karma by resolving complaints and helping your flatmates
            </p>
          </Card>
          <Card className="p-6 text-center">
            <Medal className="w-12 h-12 text-accent mx-auto mb-3" />
            <h3 className="text-lg font-semibold mb-2">Monthly Reset</h3>
            <p className="text-sm text-gray-600">
              Leaderboard resets monthly to give everyone a fresh start
            </p>
          </Card>
          <Card className="p-6 text-center">
            <Trophy className="w-12 h-12 text-warning mx-auto mb-3" />
            <h3 className="text-lg font-semibold mb-2">Best Flatmate</h3>
            <p className="text-sm text-gray-600">
              Top karma earner gets the coveted "Best Flatmate" badge
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}
