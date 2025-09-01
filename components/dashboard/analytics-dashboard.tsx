"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { BarChart3, Eye, MousePointer, QrCode, Share, TrendingUp } from "lucide-react"
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

interface AnalyticsData {
  views: number
  qrScans: number
  contactClicks: number
  socialClicks: number
  uniqueVisitors: number
  deviceBreakdown: Record<string, number>
  geoData: Record<string, number>
  referrerData: Record<string, number>
}

interface AnalyticsDashboardProps {
  cardId: string
}

export function AnalyticsDashboard({ cardId }: AnalyticsDashboardProps) {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [timeRange, setTimeRange] = useState("7d")

  useEffect(() => {
    fetchAnalytics()
  }, [cardId, timeRange])

  const fetchAnalytics = async () => {
    try {
      const response = await fetch(`/api/analytics/${cardId}?range=${timeRange}`)
      if (!response.ok) throw new Error("Failed to fetch analytics")
      const data = await response.json()
      setAnalytics(data)
    } catch (error) {
      console.error("Error fetching analytics:", error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="text-center text-gray-400">Loading analytics...</div>
      </div>
    )
  }

  if (!analytics) {
    return (
      <Card className="bg-gray-800/50 border-gray-700">
        <CardContent className="p-8 text-center">
          <p className="text-gray-400">No analytics data available yet</p>
          <p className="text-gray-500 text-sm mt-2">
            Share your card to start collecting analytics
          </p>
        </CardContent>
      </Card>
    )
  }

  // Prepare chart data
  const deviceData = Object.entries(analytics.deviceBreakdown).map(([device, count]) => ({
    name: device,
    value: count,
  }))

  const geoData = Object.entries(analytics.geoData)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10)
    .map(([country, count]) => ({
      name: country,
      value: count,
    }))

  const referrerData = Object.entries(analytics.referrerData)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([referrer, count]) => ({
      name: referrer,
      value: count,
    }))

  const colors = ["#ea580c", "#f97316", "#fb923c", "#fed7aa", "#ffedd5"]

  // Mock time series data - you would get this from your API
  const timeSeriesData = [
    { date: "Mon", views: 12, clicks: 3 },
    { date: "Tue", views: 19, clicks: 5 },
    { date: "Wed", views: 8, clicks: 2 },
    { date: "Thu", views: 25, clicks: 8 },
    { date: "Fri", views: 18, clicks: 6 },
    { date: "Sat", views: 32, clicks: 12 },
    { date: "Sun", views: 28, clicks: 9 },
  ]

  return (
    <div className="space-y-6">
      {/* Time Range Selector */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Analytics Dashboard</h2>
        <div className="flex gap-2">
          {[
            { label: "7 Days", value: "7d" },
            { label: "30 Days", value: "30d" },
            { label: "90 Days", value: "90d" },
          ].map((range) => (
            <Button
              key={range.value}
              variant={timeRange === range.value ? "default" : "outline"}
              size="sm"
              onClick={() => setTimeRange(range.value)}
              className={timeRange === range.value ? "bg-orange-600" : ""}
            >
              {range.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-gray-400">
                Total Views
              </CardTitle>
              <Eye className="h-4 w-4 text-gray-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{analytics.views}</div>
            <div className="flex items-center gap-1 mt-1">
              <TrendingUp className="h-3 w-3 text-green-400" />
              <span className="text-xs text-green-400">+12%</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-gray-400">
                QR Scans
              </CardTitle>
              <QrCode className="h-4 w-4 text-gray-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{analytics.qrScans}</div>
            <div className="flex items-center gap-1 mt-1">
              <TrendingUp className="h-3 w-3 text-green-400" />
              <span className="text-xs text-green-400">+8%</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-gray-400">
                Contact Clicks
              </CardTitle>
              <MousePointer className="h-4 w-4 text-gray-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{analytics.contactClicks}</div>
            <div className="flex items-center gap-1 mt-1">
              <TrendingUp className="h-3 w-3 text-green-400" />
              <span className="text-xs text-green-400">+15%</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-gray-400">
                Social Clicks
              </CardTitle>
              <Share className="h-4 w-4 text-gray-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{analytics.socialClicks}</div>
            <div className="flex items-center gap-1 mt-1">
              <TrendingUp className="h-3 w-3 text-green-400" />
              <span className="text-xs text-green-400">+5%</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Views Over Time */}
        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Views Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={timeSeriesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="date" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: "#1f2937", 
                    border: "1px solid #374151",
                    borderRadius: "6px"
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="views" 
                  stroke="#ea580c" 
                  strokeWidth={2}
                  dot={{ fill: "#ea580c" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Device Breakdown */}
        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Device Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            {deviceData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={deviceData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    label={({ name, percent }: any) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                  >
                    {deviceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-gray-400">
                No device data available
              </div>
            )}
          </CardContent>
        </Card>

        {/* Geographic Data */}
        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Top Countries</CardTitle>
          </CardHeader>
          <CardContent>
            {geoData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={geoData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="name" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: "#1f2937", 
                      border: "1px solid #374151",
                      borderRadius: "6px"
                    }}
                  />
                  <Bar dataKey="value" fill="#ea580c" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-gray-400">
                No geographic data available
              </div>
            )}
          </CardContent>
        </Card>

        {/* Referrer Sources */}
        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Traffic Sources</CardTitle>
          </CardHeader>
          <CardContent>
            {referrerData.length > 0 ? (
              <div className="space-y-4">
                {referrerData.map((referrer, index) => (
                  <div key={referrer.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: colors[index % colors.length] }}
                      />
                      <span className="text-white text-sm">
                        {referrer.name === "Direct" ? "Direct Traffic" : referrer.name}
                      </span>
                    </div>
                    <Badge variant="secondary" className="bg-gray-700">
                      {referrer.value}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-[280px] flex items-center justify-center text-gray-400">
                No referrer data available
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}