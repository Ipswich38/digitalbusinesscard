import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Eye, MousePointer, Users, TrendingUp, Calendar, Star } from "lucide-react"
import type { UserData } from "./types"

interface AnalyticsDashboardProps {
  userData: UserData
}

export function AnalyticsDashboard({ userData }: AnalyticsDashboardProps) {
  const { analytics, backContent } = userData

  if (!analytics.enabled) {
    return (
      <Card className="bg-gray-800/50 border-gray-700">
        <CardContent className="p-6 text-center">
          <p className="text-gray-400">Analytics are disabled</p>
        </CardContent>
      </Card>
    )
  }

  const totalInteractions = analytics.cardViews + analytics.qrScans + analytics.contactClicks + analytics.socialClicks
  const mostPopularSection = Object.entries(analytics.popularSections).sort(([, a], [, b]) => b - a)[0]

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <Card className="bg-gray-800/50 border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-500/20">
                <Eye className="h-5 w-5 text-blue-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{analytics.cardViews}</p>
                <p className="text-xs text-gray-400">Card Views</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800/50 border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-orange-500/20">
                <MousePointer className="h-5 w-5 text-orange-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{analytics.qrScans}</p>
                <p className="text-xs text-gray-400">QR Scans</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800/50 border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-500/20">
                <Users className="h-5 w-5 text-green-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{analytics.contactClicks}</p>
                <p className="text-xs text-gray-400">Contact Clicks</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800/50 border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-purple-500/20">
                <TrendingUp className="h-5 w-5 text-purple-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{totalInteractions}</p>
                <p className="text-xs text-gray-400">Total Interactions</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {mostPopularSection && (
        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader className="pb-3">
            <CardTitle className="text-white text-sm flex items-center gap-2">
              <Star className="h-4 w-4 text-yellow-400" />
              Most Popular Section
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-white capitalize">{mostPopularSection[0]}</span>
              <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-400">
                {mostPopularSection[1]} views
              </Badge>
            </div>
          </CardContent>
        </Card>
      )}

      {backContent.portfolio.enabled && backContent.portfolio.analytics.enabled && (
        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader className="pb-3">
            <CardTitle className="text-white text-sm">Portfolio Performance</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {backContent.portfolio.projects.slice(0, 3).map((project) => (
              <div key={project.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-white text-sm">{project.title}</span>
                  <div className="flex items-center gap-2">
                    {project.metrics?.views && (
                      <Badge variant="outline" className="text-xs">
                        {project.metrics.views} views
                      </Badge>
                    )}
                    {project.metrics?.clicks && (
                      <Badge variant="outline" className="text-xs">
                        {project.metrics.clicks} clicks
                      </Badge>
                    )}
                  </div>
                </div>
                {project.metrics?.engagement && (
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-400">Engagement</span>
                      <span className="text-gray-400">{project.metrics.engagement}%</span>
                    </div>
                    <Progress value={project.metrics.engagement} className="h-1" />
                  </div>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {analytics.lastViewed && (
        <Card className="bg-gray-800/50 border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Calendar className="h-4 w-4 text-gray-400" />
              <div>
                <p className="text-sm text-white">Last Viewed</p>
                <p className="text-xs text-gray-400">{new Date(analytics.lastViewed).toLocaleDateString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
