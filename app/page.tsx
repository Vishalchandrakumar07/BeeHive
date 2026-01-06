import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Building2,
  Store,
  ShoppingBag,
  Sparkles,
  ArrowRight,
  Users,
  Clock,
  MapPin,
  MessageCircle,
  Package,
} from "lucide-react"
import { createClient } from "@/lib/server"
import { Navbar } from "@/components/navbar"
// import { BannerCarousel } from "@/components/banner-carousel"
import { BrandsCarousel } from "@/components/brands-carousel"

export default async function HomePage() {
  const supabase = await createClient()
  const { data: apartments } = await supabase.from("apartments").select("*").order("name")
  const { data: shops } = await supabase.from("shops").select("*")

  const apartmentCount = apartments?.length || 0
  const shopCount = shops?.length || 0

  return (
    <div className="min-h-screen">
      {/* Navbar Component */}
      <Navbar />

      {/* Banner Carousel Component */}
      {/* <BannerCarousel /> */}

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-primary/10">
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
        <div className="container max-w-6xl mx-auto px-4 py-20 relative">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              <span>Quality Service, Live Better</span>
            </div>

            <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Reach Technicians for Daily Need.
            </h1>

            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              A platform that connects you with trusted, quality technicians for AC, Washing Machine, RO, and Car service & maintenance directly through WhatsApp
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <Button size="lg" className="text-base" asChild>
                <Link href="#apartments">
                  <ShoppingBag className="w-5 h-5 mr-2" />
                  Book Service
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="text-base bg-transparent" asChild>
                <Link href="/auth/seller/sign-up">
                  <Store className="w-5 h-5 mr-2" />
                  Become a Technician
                </Link>
              </Button>
            </div>

            {/* Workflow Visualization */}
            <div className="bg-card/50 backdrop-blur rounded-2xl border border-primary/20 p-8 mb-12">
              <h3 className="text-xl font-semibold mb-8">How It Works</h3>
              <div className="grid md:grid-cols-4 gap-6">
                {/* Step 1 */}
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold mb-3">
                    1
                  </div>
                  <div className="w-10 h-1 bg-gradient-to-r from-primary to-primary/30 mx-auto mb-4 hidden md:block" />
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                    <MapPin className="w-6 h-6 text-primary" />
                  </div>
                  <p className="font-semibold text-sm mb-2">Choose Community</p>
                  <p className="text-xs text-muted-foreground">Select your apartment complex</p>
                </div>

                {/* Step 2 */}
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold mb-3">
                    2
                  </div>
                  <div className="w-10 h-1 bg-gradient-to-r from-primary to-primary/30 mx-auto mb-4 hidden md:block" />
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                    <Store className="w-6 h-6 text-primary" />
                  </div>
                  <p className="font-semibold text-sm mb-2">Book Service</p>
                  <p className="text-xs text-muted-foreground">Explore local vendors</p>
                </div>

                {/* Step 3 */}
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold mb-3">
                    3
                  </div>
                  <div className="w-10 h-1 bg-gradient-to-r from-primary to-primary/30 mx-auto mb-4 hidden md:block" />
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                    <MessageCircle className="w-6 h-6 text-primary" />
                  </div>
                  <p className="font-semibold text-sm mb-2">Send Details on WhatsApp</p>
                  <p className="text-xs text-muted-foreground">Quick checkout via chat</p>
                </div>

                {/* Step 4 */}
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold mb-3">
                    4
                  </div>
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                    <Package className="w-6 h-6 text-primary" />
                  </div>
                  <p className="font-semibold text-sm mb-2">Technician at your Door Step</p>
                  <p className="text-xs text-muted-foreground">Get it to your door</p>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">{apartmentCount}+</div>
                <div className="text-sm text-muted-foreground mt-1">Communities</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">{shopCount}+</div>
                <div className="text-sm text-muted-foreground mt-1">Technicians</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">100%</div>
                <div className="text-sm text-muted-foreground mt-1">Satisfaction</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      
      {/* Brands Carousel Section */}
      {/* <BrandsCarousel /> */}

      {/* Apartments Section */}
      <section id="apartments" className="py-20">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Select Your Community</h2>
            <p className="text-muted-foreground">Choose your apartment to Service you better</p>
          </div>

          {apartments && apartments.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {apartments.map((apartment) => (
                <Link key={apartment.id} href={`/customer/${apartment.id}`} className="block group">
                  <Card className="h-full border-2 hover:border-primary hover:shadow-lg transition-all">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="p-3 bg-gradient-to-br from-primary to-primary/80 rounded-xl shadow-lg group-hover:scale-110 transition-transform">
                          <Building2 className="w-6 h-6 text-primary-foreground" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg mb-1 group-hover:text-primary transition-colors">
                            {apartment.name}
                          </h3>
                          <p className="text-sm text-muted-foreground line-clamp-2">{apartment.address}</p>
                        </div>
                      </div>
                      <div className="mt-4 pt-4 border-t border-border flex items-center justify-between text-sm text-muted-foreground">
                        {/* <span>Browse shops</span> */}
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <Card className="max-w-md mx-auto">
              <CardContent className="p-8 text-center">
                <Building2 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground mb-4">No apartments available yet</p>
                <Button variant="outline" asChild>
                  <Link href="/auth/admin/login">Admin Login</Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-card/50">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Why Choose BeeHive?</h2>
            {/* <p className="text-muted-foreground max-w-2xl mx-auto">
              Experience the convenience of shopping from your trusted neighborhood stores
            </p> */}
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <Card className="border-2 hover:border-primary/50 transition-colors">
              <CardContent className="p-6">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <MapPin className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Around Community</h3>
                <p className="text-muted-foreground text-sm">
                  Browse products from shops right in your apartment complex. Support your local community.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-primary/50 transition-colors">
              <CardContent className="p-6">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Clock className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Service at Door Step</h3>
                <p className="text-muted-foreground text-sm">
                  Place orders instantly via WhatsApp. No complicated checkouts or payment hassles.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-primary/50 transition-colors">
              <CardContent className="p-6">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Trusted Technician</h3>
                <p className="text-muted-foreground text-sm">
                  Shop from verified local businesses. Build relationships with your neighborhood vendors.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>


      {/* Footer */}
      <footer className="border-t border-border bg-card py-12">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-semibold mb-4">For Guest</h3>
              <div className="space-y-2 text-sm text-muted-foreground">
                <Link href="#apartments" className="block hover:text-primary">
                  Book Service
                </Link>
                <Link href="#apartments" className="block hover:text-primary">
                  How It Works
                </Link>
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-4">For Technicians</h3>
              <div className="space-y-2 text-sm text-muted-foreground">
                <Link href="/auth/seller/sign-up" className="block hover:text-primary">
                  Sign Up
                </Link>
                <Link href="/auth/seller/login" className="block hover:text-primary">
                  Login
                </Link>
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Admin</h3>
              <div className="space-y-2 text-sm text-muted-foreground">
                <Link href="/auth/admin/login" className="block hover:text-primary">
                  Admin Login
                </Link>
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-4">BeeHive</h3>
              <p className="text-sm text-muted-foreground">
                Connecting communities with local businesses, one apartment at a time.
              </p>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-border flex justify-center">
  <img
    src="/logo.jpg"
    alt="BeeHive logo"
    className="h-9 opacity-80 hover:opacity-100 transition"
  />
</div>



        </div>
      </footer>
    </div>
  )
}