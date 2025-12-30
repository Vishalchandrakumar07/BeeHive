"use client"

import { useEffect, useRef } from "react"
import { Package, Utensils, Zap, Shirt, Home, Heart, Dumbbell, BookOpen } from "lucide-react"

export function BrandsCarousel() {
  const carouselRef = useRef<HTMLDivElement>(null)

  const brands = [
    { id: 1, name: "Fresh Groceries", icon: Utensils, color: "from-green-400 to-green-600" },
    { id: 2, name: "Daily Essentials", icon: Package, color: "from-blue-400 to-blue-600" },
    { id: 3, name: "Electronics", icon: Zap, color: "from-purple-400 to-purple-600" },
    { id: 4, name: "Fashion & Apparel", icon: Shirt, color: "from-pink-400 to-pink-600" },
    { id: 5, name: "Home & Living", icon: Home, color: "from-orange-400 to-orange-600" },
    { id: 6, name: "Beauty & Wellness", icon: Heart, color: "from-rose-400 to-rose-600" },
    { id: 7, name: "Sports & Fitness", icon: Dumbbell, color: "from-cyan-400 to-cyan-600" },
    { id: 8, name: "Books & Media", icon: BookOpen, color: "from-indigo-400 to-indigo-600" },
  ]

  const duplicatedBrands = [...brands, ...brands, ...brands]

  useEffect(() => {
    const carousel = carouselRef.current
    if (!carousel) return

    let scrollPosition = 0
    const scrollSpeed = 0.5 // pixels per frame
    let animationFrameId: number

    const scroll = () => {
      scrollPosition += scrollSpeed
      if (carousel) {
        carousel.scrollLeft = scrollPosition

        // Reset smoothly when reaching the end
        if (scrollPosition >= carousel.scrollWidth / 3) {
          scrollPosition = 0
        }
      }
      animationFrameId = requestAnimationFrame(scroll)
    }

    animationFrameId = requestAnimationFrame(scroll)

    return () => cancelAnimationFrame(animationFrameId)
  }, [])

  return (
    <section className="py-16 bg-gradient-to-b from-background to-card/30 overflow-hidden">
      <div className="container max-w-6xl mx-auto px-4 mb-8">
        <h2 className="text-3xl font-bold text-center">Popular Brands & Categories</h2>
        <p className="text-center text-muted-foreground mt-2">Browse products from top local brands</p>
      </div>

      {/* Carousel Container */}
      <div
        ref={carouselRef}
        className="flex gap-4 px-4 overflow-x-hidden"
        style={{
          scrollBehavior: "auto",
          WebkitOverflowScrolling: "auto",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        {/* Hide scrollbar */}
        <style>{`
          div::-webkit-scrollbar {
            display: none;
          }
        `}</style>

        {duplicatedBrands.map((brand, index) => {
          const Icon = brand.icon
          const [colorFrom, colorTo] = brand.color.split(" ")
          return (
            <div
              key={`${brand.id}-${index}`}
              className="flex-shrink-0 w-64 h-40 rounded-xl bg-gradient-to-br hover:shadow-lg transition-shadow cursor-pointer"
              style={{
                backgroundImage: `linear-gradient(135deg, var(--color-${colorFrom.split("-")[1]}), var(--color-${colorTo.split("-")[1]}))`,
              }}
            >
              <div className="bg-white/20 backdrop-blur rounded-lg p-6 w-full h-full flex flex-col items-center justify-center">
                <Icon className="w-8 h-8 text-white mb-3" />
                <h3 className="font-semibold text-white text-lg text-center">{brand.name}</h3>
                <p className="text-white/70 text-xs mt-2">Explore Products</p>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
