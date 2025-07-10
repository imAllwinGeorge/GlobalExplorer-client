"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import type { Activity } from "../../../shared/types/global"
import ActivtyCardUser from "./ActiviyCard-user"
import { Button } from "../ui/button"

interface UserActivityCarouselProps {
  activities: Activity[]
  onCardClick?: (activity: Activity) => void
  title?: string
}

export default function Carousel({
  activities,
  onCardClick,
  title = "Popular Activities",
}: UserActivityCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const cardsPerView = 4
  const maxIndex = Math.max(0, activities.length - cardsPerView)

  const handlePrevious = () => {
    setCurrentIndex((prev) => Math.max(0, prev - 1))
  }

  const handleNext = () => {
    setCurrentIndex((prev) => Math.min(maxIndex, prev + 1))
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="icon"
            onClick={handlePrevious}
            disabled={currentIndex === 0}
            className="rounded-full bg-transparent"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={handleNext}
            disabled={currentIndex >= maxIndex}
            className="rounded-full"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Carousel */}
      <div className="relative overflow-hidden">
        <div
          className="flex transition-transform duration-300 ease-in-out gap-6 p-2"
          style={{
            transform: `translateX(-${currentIndex * (100 / cardsPerView)}%)`,
          }}
        >
          {activities.map((activity, index) => (
            <div key={index} className="flex-shrink-0 w-1/4">
              <ActivtyCardUser activity={activity} onCardClick={onCardClick} />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
