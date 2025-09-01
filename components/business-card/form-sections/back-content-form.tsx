"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Plus, Trash2, Briefcase, Award, MessageSquare, User, BarChart3, Star } from "lucide-react"
import type { UserData } from "../types"
import { AnalyticsDashboard } from "../analytics-dashboard"

interface BackContentFormProps {
  userData: UserData
  onInputChange: (field: keyof UserData, value: any) => void
}

export function BackContentForm({ userData, onInputChange }: BackContentFormProps) {
  const addPortfolioProject = () => {
    const newProject = {
      id: Date.now().toString(),
      title: "",
      description: "",
      image: "",
      url: "",
      category: "",
      tags: [],
      featured: false,
      completionDate: "",
      clientName: "",
      techStack: [],
      metrics: {
        views: 0,
        clicks: 0,
        conversions: 0,
        engagement: 0,
      },
    }
    onInputChange("backContent", {
      ...userData.backContent,
      portfolio: {
        ...userData.backContent.portfolio,
        projects: [...userData.backContent.portfolio.projects, newProject],
      },
    })
  }

  const removePortfolioProject = (id: string) => {
    onInputChange("backContent", {
      ...userData.backContent,
      portfolio: {
        ...userData.backContent.portfolio,
        projects: userData.backContent.portfolio.projects.filter((p) => p.id !== id),
      },
    })
  }

  const updatePortfolioProject = (id: string, field: string, value: any) => {
    onInputChange("backContent", {
      ...userData.backContent,
      portfolio: {
        ...userData.backContent.portfolio,
        projects: userData.backContent.portfolio.projects.map((p) => (p.id === id ? { ...p, [field]: value } : p)),
      },
    })
  }

  const addProjectTag = (projectId: string, tag: string) => {
    if (!tag.trim()) return
    const project = userData.backContent.portfolio.projects.find((p) => p.id === projectId)
    if (project && !project.tags.includes(tag)) {
      updatePortfolioProject(projectId, "tags", [...project.tags, tag])
    }
  }

  const removeProjectTag = (projectId: string, tagToRemove: string) => {
    const project = userData.backContent.portfolio.projects.find((p) => p.id === projectId)
    if (project) {
      updatePortfolioProject(
        projectId,
        "tags",
        project.tags.filter((tag) => tag !== tagToRemove),
      )
    }
  }

  const addService = () => {
    const newService = {
      id: Date.now().toString(),
      title: "",
      description: "",
      icon: "",
    }
    onInputChange("backContent", {
      ...userData.backContent,
      services: {
        ...userData.backContent.services,
        items: [...userData.backContent.services.items, newService],
      },
    })
  }

  const removeService = (id: string) => {
    onInputChange("backContent", {
      ...userData.backContent,
      services: {
        ...userData.backContent.services,
        items: userData.backContent.services.items.filter((s) => s.id !== id),
      },
    })
  }

  const updateService = (id: string, field: string, value: string) => {
    onInputChange("backContent", {
      ...userData.backContent,
      services: {
        ...userData.backContent.services,
        items: userData.backContent.services.items.map((s) => (s.id === id ? { ...s, [field]: value } : s)),
      },
    })
  }

  const addTestimonial = () => {
    const newTestimonial = {
      id: Date.now().toString(),
      text: "",
      author: "",
      role: "",
    }
    onInputChange("backContent", {
      ...userData.backContent,
      testimonials: {
        ...userData.backContent.testimonials,
        items: [...userData.backContent.testimonials.items, newTestimonial],
      },
    })
  }

  const removeTestimonial = (id: string) => {
    onInputChange("backContent", {
      ...userData.backContent,
      testimonials: {
        ...userData.backContent.testimonials,
        items: userData.backContent.testimonials.items.filter((t) => t.id !== id),
      },
    })
  }

  const updateTestimonial = (id: string, field: string, value: string) => {
    onInputChange("backContent", {
      ...userData.backContent,
      testimonials: {
        ...userData.backContent.testimonials,
        items: userData.backContent.testimonials.items.map((t) => (t.id === id ? { ...t, [field]: value } : t)),
      },
    })
  }

  const addAchievement = () => {
    onInputChange("backContent", {
      ...userData.backContent,
      additionalInfo: {
        ...userData.backContent.additionalInfo,
        achievements: [...userData.backContent.additionalInfo.achievements, ""],
      },
    })
  }

  const removeAchievement = (index: number) => {
    onInputChange("backContent", {
      ...userData.backContent,
      additionalInfo: {
        ...userData.backContent.additionalInfo,
        achievements: userData.backContent.additionalInfo.achievements.filter((_, i) => i !== index),
      },
    })
  }

  const updateAchievement = (index: number, value: string) => {
    onInputChange("backContent", {
      ...userData.backContent,
      additionalInfo: {
        ...userData.backContent.additionalInfo,
        achievements: userData.backContent.additionalInfo.achievements.map((a, i) => (i === index ? value : a)),
      },
    })
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-white">Back Side Content</h2>
        <p className="text-gray-400">Add portfolio, services, testimonials, and analytics</p>
      </div>

      <Tabs defaultValue="portfolio" className="w-full">
        <TabsList className="grid w-full grid-cols-5 bg-gray-800/50">
          <TabsTrigger value="portfolio" className="text-xs">
            <Briefcase className="h-4 w-4 mr-1" />
            Portfolio
          </TabsTrigger>
          <TabsTrigger value="services" className="text-xs">
            <Award className="h-4 w-4 mr-1" />
            Services
          </TabsTrigger>
          <TabsTrigger value="testimonials" className="text-xs">
            <MessageSquare className="h-4 w-4 mr-1" />
            Reviews
          </TabsTrigger>
          <TabsTrigger value="about" className="text-xs">
            <User className="h-4 w-4 mr-1" />
            About
          </TabsTrigger>
          <TabsTrigger value="analytics" className="text-xs">
            <BarChart3 className="h-4 w-4 mr-1" />
            Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="portfolio" className="space-y-4">
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-white text-lg">Portfolio Projects</CardTitle>
                <Switch
                  checked={userData.backContent.portfolio.enabled}
                  onCheckedChange={(checked) =>
                    onInputChange("backContent", {
                      ...userData.backContent,
                      portfolio: { ...userData.backContent.portfolio, enabled: checked },
                    })
                  }
                />
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-gray-700/30 rounded-lg space-y-3">
                <Label className="text-white text-sm">Display Options</Label>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-gray-300 text-xs">Layout</Label>
                    <Select
                      value={userData.backContent.portfolio.displayOptions.layout}
                      onValueChange={(value) =>
                        onInputChange("backContent", {
                          ...userData.backContent,
                          portfolio: {
                            ...userData.backContent.portfolio,
                            displayOptions: { ...userData.backContent.portfolio.displayOptions, layout: value },
                          },
                        })
                      }
                    >
                      <SelectTrigger className="bg-gray-800/50 border-gray-600 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="grid">Grid</SelectItem>
                        <SelectItem value="list">List</SelectItem>
                        <SelectItem value="carousel">Carousel</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-gray-300 text-xs">Sort By</Label>
                    <Select
                      value={userData.backContent.portfolio.displayOptions.sortBy}
                      onValueChange={(value) =>
                        onInputChange("backContent", {
                          ...userData.backContent,
                          portfolio: {
                            ...userData.backContent.portfolio,
                            displayOptions: { ...userData.backContent.portfolio.displayOptions, sortBy: value },
                          },
                        })
                      }
                    >
                      <SelectTrigger className="bg-gray-800/50 border-gray-600 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="date">Date</SelectItem>
                        <SelectItem value="featured">Featured</SelectItem>
                        <SelectItem value="category">Category</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="show-tech"
                      checked={userData.backContent.portfolio.displayOptions.showTechStack}
                      onCheckedChange={(checked) =>
                        onInputChange("backContent", {
                          ...userData.backContent,
                          portfolio: {
                            ...userData.backContent.portfolio,
                            displayOptions: {
                              ...userData.backContent.portfolio.displayOptions,
                              showTechStack: checked,
                            },
                          },
                        })
                      }
                    />
                    <Label htmlFor="show-tech" className="text-gray-300 text-xs">
                      Show Tech Stack
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="show-metrics"
                      checked={userData.backContent.portfolio.displayOptions.showMetrics}
                      onCheckedChange={(checked) =>
                        onInputChange("backContent", {
                          ...userData.backContent,
                          portfolio: {
                            ...userData.backContent.portfolio,
                            displayOptions: { ...userData.backContent.portfolio.displayOptions, showMetrics: checked },
                          },
                        })
                      }
                    />
                    <Label htmlFor="show-metrics" className="text-gray-300 text-xs">
                      Show Metrics
                    </Label>
                  </div>
                </div>
              </div>

              {userData.backContent.portfolio.projects.map((project) => (
                <div key={project.id} className="p-4 bg-gray-700/50 rounded-lg space-y-3">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2">
                      <Label className="text-white text-sm">
                        Project {userData.backContent.portfolio.projects.indexOf(project) + 1}
                      </Label>
                      {project.featured && <Star className="h-4 w-4 text-yellow-400" />}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removePortfolioProject(project.id)}
                      className="text-red-400 hover:text-red-300 h-8 w-8 p-0"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label className="text-gray-300 text-xs">Title</Label>
                      <Input
                        value={project.title}
                        onChange={(e) => updatePortfolioProject(project.id, "title", e.target.value)}
                        className="bg-gray-800/50 border-gray-600 text-white"
                        placeholder="Project name"
                      />
                    </div>
                    <div>
                      <Label className="text-gray-300 text-xs">Category</Label>
                      <Input
                        value={project.category}
                        onChange={(e) => updatePortfolioProject(project.id, "category", e.target.value)}
                        className="bg-gray-800/50 border-gray-600 text-white"
                        placeholder="Web Development"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label className="text-gray-300 text-xs">URL</Label>
                      <Input
                        value={project.url || ""}
                        onChange={(e) => updatePortfolioProject(project.id, "url", e.target.value)}
                        className="bg-gray-800/50 border-gray-600 text-white"
                        placeholder="https://..."
                      />
                    </div>
                    <div>
                      <Label className="text-gray-300 text-xs">Completion Date</Label>
                      <Input
                        type="date"
                        value={project.completionDate}
                        onChange={(e) => updatePortfolioProject(project.id, "completionDate", e.target.value)}
                        className="bg-gray-800/50 border-gray-600 text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <Label className="text-gray-300 text-xs">Description</Label>
                    <Textarea
                      value={project.description}
                      onChange={(e) => updatePortfolioProject(project.id, "description", e.target.value)}
                      className="bg-gray-800/50 border-gray-600 text-white resize-none"
                      rows={2}
                      placeholder="Brief project description"
                    />
                  </div>

                  <div>
                    <Label className="text-gray-300 text-xs">Tags</Label>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {project.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="bg-orange-500/20 text-orange-400">
                          {tag}
                          <button
                            onClick={() => removeProjectTag(project.id, tag)}
                            className="ml-1 text-orange-300 hover:text-orange-200"
                          >
                            ×
                          </button>
                        </Badge>
                      ))}
                    </div>
                    <Input
                      placeholder="Add tag and press Enter"
                      className="bg-gray-800/50 border-gray-600 text-white"
                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          addProjectTag(project.id, e.currentTarget.value)
                          e.currentTarget.value = ""
                        }
                      }}
                    />
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id={`featured-${project.id}`}
                        checked={project.featured}
                        onCheckedChange={(checked) => updatePortfolioProject(project.id, "featured", checked)}
                      />
                      <Label htmlFor={`featured-${project.id}`} className="text-gray-300 text-xs">
                        Featured
                      </Label>
                    </div>
                  </div>
                </div>
              ))}

              <Button
                onClick={addPortfolioProject}
                variant="outline"
                className="w-full bg-gray-800/50 border-gray-600 text-white hover:bg-gray-700/50"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Project
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-white text-lg">Analytics & Insights</CardTitle>
                <Switch
                  checked={userData.analytics.enabled}
                  onCheckedChange={(checked) => onInputChange("analytics", { ...userData.analytics, enabled: checked })}
                />
              </div>
            </CardHeader>
            <CardContent>
              <AnalyticsDashboard userData={userData} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="services" className="space-y-4">
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-white text-lg">Services Offered</CardTitle>
                <Switch
                  checked={userData.backContent.services.enabled}
                  onCheckedChange={(checked) =>
                    onInputChange("backContent", {
                      ...userData.backContent,
                      services: { ...userData.backContent.services, enabled: checked },
                    })
                  }
                />
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {userData.backContent.services.items.map((service) => (
                <div key={service.id} className="p-4 bg-gray-700/50 rounded-lg space-y-3">
                  <div className="flex justify-between items-start">
                    <Label className="text-white text-sm">
                      Service {userData.backContent.services.items.indexOf(service) + 1}
                    </Label>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeService(service.id)}
                      className="text-red-400 hover:text-red-300 h-8 w-8 p-0"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <div>
                    <Label className="text-gray-300 text-xs">Service Name</Label>
                    <Input
                      value={service.title}
                      onChange={(e) => updateService(service.id, "title", e.target.value)}
                      className="bg-gray-800/50 border-gray-600 text-white"
                      placeholder="e.g., Web Development"
                    />
                  </div>
                  <div>
                    <Label className="text-gray-300 text-xs">Description</Label>
                    <Textarea
                      value={service.description}
                      onChange={(e) => updateService(service.id, "description", e.target.value)}
                      className="bg-gray-800/50 border-gray-600 text-white resize-none"
                      rows={2}
                      placeholder="Brief service description"
                    />
                  </div>
                </div>
              ))}
              <Button
                onClick={addService}
                variant="outline"
                className="w-full bg-gray-800/50 border-gray-600 text-white hover:bg-gray-700/50"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Service
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="testimonials" className="space-y-4">
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-white text-lg">Client Testimonials</CardTitle>
                <Switch
                  checked={userData.backContent.testimonials.enabled}
                  onCheckedChange={(checked) =>
                    onInputChange("backContent", {
                      ...userData.backContent,
                      testimonials: { ...userData.backContent.testimonials, enabled: checked },
                    })
                  }
                />
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {userData.backContent.testimonials.items.map((testimonial) => (
                <div key={testimonial.id} className="p-4 bg-gray-700/50 rounded-lg space-y-3">
                  <div className="flex justify-between items-start">
                    <Label className="text-white text-sm">
                      Testimonial {userData.backContent.testimonials.items.indexOf(testimonial) + 1}
                    </Label>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeTestimonial(testimonial.id)}
                      className="text-red-400 hover:text-red-300 h-8 w-8 p-0"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <div>
                    <Label className="text-gray-300 text-xs">Testimonial Text</Label>
                    <Textarea
                      value={testimonial.text}
                      onChange={(e) => updateTestimonial(testimonial.id, "text", e.target.value)}
                      className="bg-gray-800/50 border-gray-600 text-white resize-none"
                      rows={3}
                      placeholder="What did the client say?"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label className="text-gray-300 text-xs">Client Name</Label>
                      <Input
                        value={testimonial.author}
                        onChange={(e) => updateTestimonial(testimonial.id, "author", e.target.value)}
                        className="bg-gray-800/50 border-gray-600 text-white"
                        placeholder="John Doe"
                      />
                    </div>
                    <div>
                      <Label className="text-gray-300 text-xs">Role/Company</Label>
                      <Input
                        value={testimonial.role || ""}
                        onChange={(e) => updateTestimonial(testimonial.id, "role", e.target.value)}
                        className="bg-gray-800/50 border-gray-600 text-white"
                        placeholder="CEO, Company"
                      />
                    </div>
                  </div>
                </div>
              ))}
              <Button
                onClick={addTestimonial}
                variant="outline"
                className="w-full bg-gray-800/50 border-gray-600 text-white hover:bg-gray-700/50"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Testimonial
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="about" className="space-y-4">
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-white text-lg">Additional Information</CardTitle>
                <Switch
                  checked={userData.backContent.additionalInfo.enabled}
                  onCheckedChange={(checked) =>
                    onInputChange("backContent", {
                      ...userData.backContent,
                      additionalInfo: { ...userData.backContent.additionalInfo, enabled: checked },
                    })
                  }
                />
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-gray-300 text-sm">Bio/About Me</Label>
                <Textarea
                  value={userData.backContent.additionalInfo.bio}
                  onChange={(e) =>
                    onInputChange("backContent", {
                      ...userData.backContent,
                      additionalInfo: { ...userData.backContent.additionalInfo, bio: e.target.value },
                    })
                  }
                  className="bg-gray-800/50 border-gray-600 text-white resize-none"
                  rows={4}
                  placeholder="Tell people about yourself, your background, and what drives you..."
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-3">
                  <Label className="text-gray-300 text-sm">Key Achievements</Label>
                  <Button
                    onClick={addAchievement}
                    variant="outline"
                    size="sm"
                    className="bg-gray-800/50 border-gray-600 text-white hover:bg-gray-700/50"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add
                  </Button>
                </div>
                <div className="space-y-2">
                  {userData.backContent.additionalInfo.achievements.map((achievement, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        value={achievement}
                        onChange={(e) => updateAchievement(index, e.target.value)}
                        className="bg-gray-800/50 border-gray-600 text-white"
                        placeholder="e.g., 5+ years experience in..."
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeAchievement(index)}
                        className="text-red-400 hover:text-red-300 px-3"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
