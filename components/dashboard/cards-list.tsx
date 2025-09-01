"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Eye, Share, Edit, Trash2, MoreVertical, ExternalLink, QrCode } from "lucide-react"
import { toast } from "sonner"

interface BusinessCard {
  id: string
  title: string
  slug: string
  isActive: boolean
  data: any
  createdAt: string
  updatedAt: string
  analytics?: {
    views: number
    qrScans: number
    contactClicks: number
    socialClicks: number
  }
}

interface CardsListProps {
  cards: BusinessCard[]
  onCardSelect: (cardId: string) => void
  onCardUpdate: () => void
}

export function CardsList({ cards, onCardSelect, onCardUpdate }: CardsListProps) {
  const [selectedCard, setSelectedCard] = useState<string | null>(null)

  const handleViewCard = (slug: string) => {
    window.open(`/card/${slug}`, "_blank")
  }

  const handleEditCard = (cardId: string) => {
    // Navigate to edit mode - we'll implement this
    window.location.href = `/?edit=${cardId}`
  }

  const handleShareCard = async (slug: string) => {
    const url = `${window.location.origin}/card/${slug}`
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: "My Digital Business Card",
          text: "Check out my digital business card",
          url: url,
        })
      } catch (error) {
        console.error("Error sharing:", error)
      }
    } else {
      // Fallback to clipboard
      try {
        await navigator.clipboard.writeText(url)
        toast.success("Card URL copied to clipboard!")
      } catch (error) {
        console.error("Failed to copy URL:", error)
        toast.error("Failed to copy URL")
      }
    }
  }

  const handleToggleActive = async (cardId: string, isActive: boolean) => {
    try {
      const response = await fetch(`/api/cards/${cardId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ isActive: !isActive }),
      })

      if (!response.ok) throw new Error("Failed to update card")
      
      toast.success(`Card ${!isActive ? "activated" : "deactivated"}`)
      onCardUpdate()
    } catch (error) {
      console.error("Error updating card:", error)
      toast.error("Failed to update card")
    }
  }

  const handleDeleteCard = async (cardId: string) => {
    if (!confirm("Are you sure you want to delete this card? This action cannot be undone.")) {
      return
    }

    try {
      const response = await fetch(`/api/cards/${cardId}`, {
        method: "DELETE",
      })

      if (!response.ok) throw new Error("Failed to delete card")
      
      toast.success("Card deleted successfully")
      onCardUpdate()
    } catch (error) {
      console.error("Error deleting card:", error)
      toast.error("Failed to delete card")
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  if (cards.length === 0) {
    return (
      <Card className="bg-gray-800/50 border-gray-700">
        <CardContent className="p-8 text-center">
          <div className="space-y-4">
            <div className="text-gray-400 text-lg">No cards created yet</div>
            <p className="text-gray-500 text-sm">
              Create your first digital business card to get started
            </p>
            <Button 
              onClick={() => window.location.href = "/"}
              className="bg-orange-600 hover:bg-orange-700"
            >
              Create Your First Card
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {cards.map((card) => (
        <Card 
          key={card.id} 
          className={`bg-gray-800/50 border-gray-700 cursor-pointer transition-all hover:bg-gray-800/70 ${
            selectedCard === card.id ? "ring-2 ring-orange-500" : ""
          }`}
          onClick={() => {
            setSelectedCard(card.id)
            onCardSelect(card.id)
          }}
        >
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-white text-lg truncate">
                {card.title || `${card.data?.firstName || "Untitled"}'s Card`}
              </CardTitle>
              <div className="flex items-center gap-2">
                <Badge 
                  variant={card.isActive ? "default" : "secondary"}
                  className={card.isActive ? "bg-green-600" : "bg-gray-600"}
                >
                  {card.isActive ? "Active" : "Inactive"}
                </Badge>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-gray-800 border-gray-700">
                    <DropdownMenuItem 
                      onClick={(e) => {
                        e.stopPropagation()
                        handleViewCard(card.slug)
                      }}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      View Card
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={(e) => {
                        e.stopPropagation()
                        handleEditCard(card.id)
                      }}
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Card
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={(e) => {
                        e.stopPropagation()
                        handleShareCard(card.slug)
                      }}
                    >
                      <Share className="h-4 w-4 mr-2" />
                      Share Card
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={(e) => {
                        e.stopPropagation()
                        handleToggleActive(card.id, card.isActive)
                      }}
                    >
                      {card.isActive ? (
                        <>
                          <Eye className="h-4 w-4 mr-2" />
                          Deactivate
                        </>
                      ) : (
                        <>
                          <Eye className="h-4 w-4 mr-2" />
                          Activate
                        </>
                      )}
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDeleteCard(card.id)
                      }}
                      className="text-red-400 focus:text-red-400"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete Card
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-4">
            {/* Card Preview */}
            <div className="h-24 bg-gradient-to-r from-gray-700 to-gray-600 rounded-lg p-3 flex items-center">
              {card.data?.logo && (
                <img 
                  src={card.data.logo} 
                  alt="Logo" 
                  className="h-8 w-8 rounded-full mr-3"
                />
              )}
              <div>
                <div className="text-white font-medium text-sm">
                  {card.data?.firstName || "No Name"}
                </div>
                <div className="text-gray-300 text-xs">
                  {card.data?.title || "No Title"}
                </div>
                <div className="text-gray-400 text-xs">
                  {card.data?.company || "No Company"}
                </div>
              </div>
            </div>

            {/* Analytics Summary */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-gray-700/50 rounded p-2">
                <div className="text-gray-400">Views</div>
                <div className="text-white font-medium">
                  {card.analytics?.views || 0}
                </div>
              </div>
              <div className="bg-gray-700/50 rounded p-2">
                <div className="text-gray-400">QR Scans</div>
                <div className="text-white font-medium">
                  {card.analytics?.qrScans || 0}
                </div>
              </div>
            </div>

            {/* Card Details */}
            <div className="text-xs text-gray-400 space-y-1">
              <div>Created: {formatDate(card.createdAt)}</div>
              <div>Updated: {formatDate(card.updatedAt)}</div>
              <div className="flex items-center gap-1">
                <ExternalLink className="h-3 w-3" />
                <span className="truncate">/card/{card.slug}</span>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex gap-2 pt-2">
              <Button 
                size="sm" 
                variant="outline" 
                className="flex-1"
                onClick={(e) => {
                  e.stopPropagation()
                  handleViewCard(card.slug)
                }}
              >
                <Eye className="h-3 w-3 mr-1" />
                View
              </Button>
              <Button 
                size="sm" 
                variant="outline" 
                className="flex-1"
                onClick={(e) => {
                  e.stopPropagation()
                  handleShareCard(card.slug)
                }}
              >
                <Share className="h-3 w-3 mr-1" />
                Share
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}