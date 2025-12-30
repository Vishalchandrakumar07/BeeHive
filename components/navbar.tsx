"use client"

import Link from "next/link"
import Image from "next/image" // ✅ ADD THIS
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react" // ❌ removed ShoppingBag
import { useState } from "react"

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
      <div className="container max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 font-bold text-lg hover:opacity-80 transition-opacity"
          >
            <div className="w-8 h-8 rounded-lg overflow-hidden bg-white flex items-center justify-center">
              <Image
                src="/logo.png" // public/logo.png
                alt="BeeHive Logo"
                width={32}
                height={32}
                className="object-contain"
                priority
              />
            </div>
            <span className="hidden sm:inline">BeeHive</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="/#apartments" className="text-sm font-medium hover:text-primary transition-colors">
              Browse Shops
            </Link>
            <Link href="/#features" className="text-sm font-medium hover:text-primary transition-colors">
              Features
            </Link>
            <Link href="/auth/seller/sign-up" className="text-sm font-medium hover:text-primary transition-colors">
              Become a Seller
            </Link>
          </div>

          {/* Desktop Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/auth/seller/login">Seller Login</Link>
            </Button>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/auth/admin/login">Admin</Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 hover:bg-secondary rounded-lg transition-colors"
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden pb-4 border-t border-border">
            <div className="flex flex-col gap-2 pt-4">
              <Link
                href="/#apartments"
                className="px-4 py-2 text-sm hover:bg-secondary rounded transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Browse Shops
              </Link>
              <Link
                href="/#features"
                className="px-4 py-2 text-sm hover:bg-secondary rounded transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Features
              </Link>
              <Link
                href="/auth/seller/sign-up"
                className="px-4 py-2 text-sm hover:bg-secondary rounded transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Become a Seller
              </Link>

              <div className="border-t border-border pt-4 mt-2 flex flex-col gap-2">
                <Button variant="outline" size="sm" asChild className="w-full justify-start bg-transparent">
                  <Link href="/auth/seller/login">Seller Login</Link>
                </Button>
                <Button variant="outline" size="sm" asChild className="w-full justify-start bg-transparent">
                  <Link href="/auth/admin/login">Admin Login</Link>
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
