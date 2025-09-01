"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import type { UserData } from "./types"
import { History, Bookmark, Trash2, Eye, Calendar, User, Building, X, ChevronLeft, ChevronRight } from "lucide-react"

interface SavedCard {
  id: string
  name: string
  userData: UserData
  createdAt: Date
  lastModified: Date
  thumbnail?: string
  tags: string[]
}

interface CardHistoryPanelProps {
  isOpen: boolean
  onToggle: () => void
  currentUserData: UserData
  onLoadCard: (userData: UserData) => void
}

export function CardHistoryPanel({ isOpen, onToggle, currentUserData, onLoadCard }: CardHistoryPanelProps) {
  const [savedCards, setSavedCards] = useState<SavedCard[]>([])
  const [selectedCard, setSelectedCard] = useState<SavedCard | null>(null)

  // Load saved cards from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("saved-business-cards")
    if (saved) {
      try {
        const cards = JSON.parse(saved).map((card: any) => ({
          ...card,
          createdAt: new Date(card.createdAt),
          lastModified: new Date(card.lastModified),
        }))
        setSavedCards(cards)
      } catch (error) {
        console.error("Error loading saved cards:", error)
      }
    }
  }, [])

  // Save current card
  const saveCurrentCard = () => {
    const cardName = currentUserData.name || "Untitled Card"
    const newCard: SavedCard = {
      id: Date.now().toString(),
      name: cardName,
      userData: currentUserData,
      createdAt: new Date(),
      lastModified: new Date(),
      tags: [
        currentUserData.jobTitle ? "Professional" : "",
        currentUserData.company ? "Business" : "",
        currentUserData.backContent?.portfolio?.projects?.length ? "Portfolio" : "",
      ].filter(Boolean),
    }

    const updatedCards = [newCard, ...savedCards]
    setSavedCards(updatedCards)
    localStorage.setItem("saved-business-cards", JSON.stringify(updatedCards))
  }

  // Delete card
  const deleteCard = (cardId: string) => {
    const updatedCards = savedCards.filter((card) => card.id !== cardId)
    setSavedCards(updatedCards)
    localStorage.setItem("saved-business-cards", JSON.stringify(updatedCards))
    if (selectedCard?.id === cardId) {
      setSelectedCard(null)
    }
  }

  // Load card
  const loadCard = (card: SavedCard) => {
    onLoadCard(card.userData)
    setSelectedCard(card)
  }

  return (
    <>
      {/* Toggle Button */}
      <Button
        onClick={onToggle}
        variant="outline"
        size="sm"
        className="fixed top-4 right-4 z-50 bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/20 text-white"
      >
        {isOpen ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        <History className="h-4 w-4 ml-1" />
      </Button>

      {/* Side Panel */}
      <div
        className={`fixed top-0 right-0 h-full w-96 bg-black/20 backdrop-blur-xl border-l border-white/10 transform transition-transform duration-300 ease-in-out z-40 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="p-6 h-full flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Bookmark className="h-5 w-5 text-blue-400" />
              <h2 className="text-lg font-semibold text-white">Card Repository</h2>
            </div>
            <Button
              onClick={onToggle}
              variant="ghost"
              size="sm"
              className="text-white/70 hover:text-white hover:bg-white/10"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Save Current Card */}
          <Button onClick={saveCurrentCard} className="mb-4 bg-blue-600/80 hover:bg-blue-600 text-white border-0">
            <Bookmark className="h-4 w-4 mr-2" />
            Save Current Card
          </Button>

          <Separator className="mb-4 bg-white/10" />

          {/* Cards List */}
          <ScrollArea className="flex-1">
            <div className="space-y-3">
              {savedCards.length === 0 ? (
                <div className="text-center py-8 text-white/60">
                  <Bookmark className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>No saved cards yet</p>
                  <p className="text-sm">Save your current card to get started</p>
                </div>
              ) : (
                savedCards.map((card) => (
                  <Card
                    key={card.id}
                    className={`bg-white/5 border-white/10 hover:bg-white/10 transition-colors cursor-pointer ${
                      selectedCard?.id === card.id ? "ring-2 ring-blue-400/50" : ""
                    }`}
                    onClick={() => setSelectedCard(card)}
                  >
                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <CardTitle className="text-sm text-white truncate">{card.name}</CardTitle>
                          <div className="flex items-center gap-2 mt-1 text-xs text-white/60">
                            <Calendar className="h-3 w-3" />
                            {card.createdAt.toLocaleDateString()}
                          </div>
                        </div>
                        <Button
                          onClick={(e) => {
                            e.stopPropagation()
                            deleteCard(card.id)
                          }}
                          variant="ghost"
                          size="sm"
                          className="text-red-400 hover:text-red-300 hover:bg-red-400/10 h-6 w-6 p-0"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="flex items-center gap-2 text-xs text-white/70 mb-2">
                        <User className="h-3 w-3" />
                        <span className="truncate">{card.userData.jobTitle || "No title"}</span>
                      </div>
                      {card.userData.company && (
                        <div className="flex items-center gap-2 text-xs text-white/70 mb-2">
                          <Building className="h-3 w-3" />
                          <span className="truncate">{card.userData.company}</span>
                        </div>
                      )}
                      <div className="flex flex-wrap gap-1">
                        {card.tags.map((tag, index) => (
                          <Badge
                            key={index}
                            variant="secondary"
                            className="text-xs bg-blue-400/20 text-blue-300 border-0"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex gap-2 mt-3">
                        <Button
                          onClick={(e) => {
                            e.stopPropagation()
                            loadCard(card)
                          }}
                          variant="outline"
                          size="sm"
                          className="flex-1 text-xs bg-white/5 border-white/20 text-white hover:bg-white/10"
                        >
                          <Eye className="h-3 w-3 mr-1" />
                          Load
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </ScrollArea>

          {/* Stats */}
          {savedCards.length > 0 && (
            <div className="mt-4 pt-4 border-t border-white/10">
              <div className="text-xs text-white/60 text-center">
                {savedCards.length} saved card{savedCards.length !== 1 ? "s" : ""}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Backdrop */}
      {isOpen && <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30" onClick={onToggle} />}
    </>
  )
}
