"use client"

import type React from "react"

import { useEffect, useRef } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Zap, TrendingUp, Award, Clock } from "lucide-react"

interface Banner {
  id: number
  title: string
  description: string
  icon: React.ReactNode
  color: string
}

const banners: Banner[] = [
  {
    id: 1,
    title: "Flash Sale",
    description: "Get up to 50% off on fresh groceries",
    icon: <Zap className="w-6 h-6" />,
    color: "from-yellow-500 to-orange-500",
  },
  {
    id: 2,
    title: "Trending Now",
    description: "Discover the most popular items in your area",
    icon: <TrendingUp className="w-6 h-6" />,
    color: "from-blue-500 to-cyan-500",
  },
  {
    id: 3,
    title: "Award Winner",
    description: "Shop from our best rated local vendors",
    icon: <Award className="w-6 h-6" />,
    color: "from-purple-500 to-pink-500",
  },
  {
    id: 4,
    title: "Quick Delivery",
    description: "Order now, get it within 30 minutes",
    icon: <Clock className="w-6 h-6" />,
    color: "from-green-500 to-emerald-500",
  },
]

export function BannerCarousel() {
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current
    if (!scrollContainer) return

    let scrollPosition = 0
    const scrollSpeed = 1
    const maxScroll = scrollContainer.scrollWidth - scrollContainer.clientWidth

    const interval = setInterval(() => {
      scrollPosition += scrollSpeed
      if (scrollPosition > maxScroll) {
        scrollPosition = 0
      }
      scrollContainer.scrollLeft = scrollPosition
    }, 30)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="w-full overflow-hidden bg-gradient-to-r from-primary/5 via-background to-accent/5 py-8">
      <div className="container max-w-6xl mx-auto px-4">
        <h3 className="text-sm font-semibold text-muted-foreground mb-4 uppercase tracking-wider">Featured Offers</h3>

        <div
          ref={scrollContainerRef}
          className="flex gap-4 overflow-x-auto scroll-smooth pb-2 [&::-webkit-scrollbar]:h-1 [&::-webkit-scrollbar-thumb]:bg-primary/20 [&::-webkit-scrollbar-track]:bg-transparent"
        >
          {banners.map((banner) => (
            <Card
              key={banner.id}
              className="flex-shrink-0 w-72 border-2 hover:border-primary hover:shadow-lg transition-all cursor-pointer snap-center"
            >
              <CardContent className="p-6">
                <div
                  className={`w-12 h-12 rounded-lg bg-gradient-to-br ${banner.color} flex items-center justify-center text-white mb-4`}
                >
                  {banner.icon}
                </div>
                <Badge className="mb-3">
                  {banner.id} of {banners.length}
                </Badge>
                <h4 className="text-lg font-semibold mb-2">{banner.title}</h4>
                <p className="text-sm text-muted-foreground">{banner.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <p className="text-xs text-muted-foreground text-center mt-4">Scroll to see more offers</p>
      </div>
    </div>
  )
}
