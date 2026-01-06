"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Store, Package, Plus, Wrench, Edit2 } from "lucide-react"
import { createClient } from "@/lib/client"
import { SellerLogoutButton } from "@/components/seller-logout-button"
import { EditServiceDialog } from "@/components/edit-service-dialog"
import { EditProductDialog } from "@/components/edit-product-dialog"
import { DeleteServiceButton } from "@/components/delete-service-button"
import { DeleteProductButton } from "@/components/delete-product-button"

export default function SellerDashboard() {
  const [seller, setSeller] = useState<any>(null)
  const [shop, setShop] = useState<any>(null)
  const [items, setItems] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [editingItem, setEditingItem] = useState<any>(null)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const router = useRouter()

  const loadData = async () => {
    const supabase = createClient()
    const phone = localStorage.getItem("seller_phone")

    console.log("[v0] Dashboard: Loading seller data")
    console.log("[v0] Dashboard: Phone from localStorage:", phone ? "found" : "not found")

    if (!phone) {
      console.log("[v0] Dashboard: No phone, redirecting to login")
      router.push("/auth/seller/login")
      return
    }

    const { data: sellerData, error: sellerError } = await supabase
      .from("sellers")
      .select("*")
      .eq("phone", phone)
      .single()

    if (sellerError || !sellerData) {
      console.error("[v0] Dashboard: Seller fetch error:", sellerError)
      localStorage.clear()
      router.push("/auth/seller/login")
      return
    }

    console.log("[v0] Dashboard: Seller found - ID:", sellerData.id, "Type:", sellerData.seller_type)
    setSeller(sellerData)

    if (!sellerData.seller_type) {
      console.log("[v0] Dashboard: No seller type, redirecting to select-type")
      router.push("/seller/select-type")
      return
    }

    const { data: shopData, error: shopError } = await supabase
      .from("shops")
      .select("*")
      .eq("seller_id", sellerData.id)
      .single()

    if (shopError) {
      console.log("[v0] Dashboard: Shop query error:", shopError.message)
    }

    if (shopData) {
      console.log("[v0] Dashboard: Shop found - ID:", shopData.id, "Active:", shopData.is_active)
      setShop(shopData)

      if (sellerData.seller_type === "products") {
        const { data: productsData, error: productsError } = await supabase
          .from("products")
          .select("*")
          .eq("shop_id", shopData.id)
          .order("name")

        if (productsError) {
          console.error("[v0] Dashboard: Products fetch error:", productsError)
        } else {
          console.log("[v0] Dashboard: Loaded", productsData?.length || 0, "products")
          setItems(productsData || [])
        }
      } else if (sellerData.seller_type === "services") {
        const { data: servicesData, error: servicesError } = await supabase
          .from("services")
          .select("*")
          .eq("shop_id", shopData.id)
          .order("name")

        if (servicesError) {
          console.error("[v0] Dashboard: Services fetch error:", servicesError)
        } else {
          console.log("[v0] Dashboard: Loaded", servicesData?.length || 0, "services")
          setItems(servicesData || [])
        }
      }
    } else {
      console.log("[v0] Dashboard: No shop found For Technician")
    }

    setIsLoading(false)
  }

  useEffect(() => {
    loadData()
  }, [router])

  const handleRefresh = () => {
    loadData()
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    )
  }

  if (!seller) return null

  const isProducts = seller.seller_type === "products"

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="border-b border-border bg-card">
        <div className="container max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-semibold text-foreground">
              {isProducts ? "Product" : "Service"} Provider Dashboard
            </h1>
            <SellerLogoutButton />
          </div>
        </div>
      </header>

      <main className="flex-1 container max-w-6xl mx-auto px-4 py-6">
        {!shop ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Store className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <h2 className="text-lg font-medium mb-2 text-foreground">No Shop Created</h2>
              <p className="text-sm text-muted-foreground mb-4">
                Your shop is pending admin approval. Please contact admin to activate your shop.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Store className="w-5 h-5" />
                  Shop Profile
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Shop Name</p>
                    <p className="font-medium text-foreground">{shop.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Category</p>
                    <p className="font-medium text-foreground">{shop.category}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Phone</p>
                    <p className="font-medium text-foreground">{shop.phone}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Status</p>
                    <p className="font-medium text-foreground">{shop.is_active ? "Active" : "Inactive"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Business Type</p>
                    <p className="font-medium text-foreground capitalize">{seller.seller_type}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {isProducts ? (
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Package className="w-5 h-5" />
                      Products ({items.length})
                    </CardTitle>
                    <Button asChild size="sm">
                      <Link href="/seller/products/add">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Product
                      </Link>
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {items.length === 0 ? (
                    <div className="text-center py-8">
                      <Package className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">No products yet. Add your first product!</p>
                    </div>
                  ) : (
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      {items.map((product: any) => (
                        <div
                          key={product.id}
                          className="border border-border rounded-lg overflow-hidden hover:border-primary transition-colors"
                        >
                          {product.image_url && (
                            <img
                              src={product.image_url || "/placeholder.svg"}
                              alt={product.name}
                              className="w-full h-40 object-cover"
                            />
                          )}
                          <div className="p-4">
                            <h3 className="font-medium text-foreground mb-1">{product.name}</h3>
                            <p className="text-sm text-muted-foreground mb-2">₹{product.price}</p>
                            <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{product.description}</p>
                            <div className="flex items-center justify-between gap-2">
                              <span
                                className={`text-xs px-2 py-1 rounded-full ${
                                  product.is_available ? "bg-accent/10 text-accent" : "bg-muted text-muted-foreground"
                                }`}
                              >
                                {product.is_available ? "Available" : "Out of Stock"}
                              </span>
                              <div className="flex gap-1">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => {
                                    setEditingItem(product)
                                    setEditDialogOpen(true)
                                  }}
                                >
                                  <Edit2 className="w-4 h-4" />
                                </Button>
                                <DeleteProductButton
                                  productId={product.id}
                                  productName={product.name}
                                  onDeleted={handleRefresh}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Wrench className="w-5 h-5" />
                      Services ({items.length})
                    </CardTitle>
                    <Button asChild size="sm">
                      <Link href="/seller/services/add">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Service
                      </Link>
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {items.length === 0 ? (
                    <div className="text-center py-8">
                      <Wrench className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">No services yet. Add your first service!</p>
                    </div>
                  ) : (
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      {items.map((service: any) => (
                        <div
                          key={service.id}
                          className="border border-border rounded-lg overflow-hidden hover:border-primary transition-colors"
                        >
                          {service.image_url && (
                            <img
                              src={service.image_url || "/placeholder.svg"}
                              alt={service.name}
                              className="w-full h-40 object-cover"
                            />
                          )}
                          <div className="p-4">
                            <h3 className="font-medium text-foreground mb-1">{service.name}</h3>
                            <p className="text-sm text-muted-foreground mb-2">₹{service.price}</p>
                            <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{service.description}</p>
                            <div className="flex items-center justify-between gap-2">
                              <span
                                className={`text-xs px-2 py-1 rounded-full ${
                                  service.is_available ? "bg-accent/10 text-accent" : "bg-muted text-muted-foreground"
                                }`}
                              >
                                {service.is_available ? "Available" : "Unavailable"}
                              </span>
                              <div className="flex gap-1">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => {
                                    setEditingItem(service)
                                    setEditDialogOpen(true)
                                  }}
                                >
                                  <Edit2 className="w-4 h-4" />
                                </Button>
                                <DeleteServiceButton
                                  serviceId={service.id}
                                  serviceName={service.name}
                                  onDeleted={handleRefresh}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </main>

      {editingItem && isProducts && (
        <EditProductDialog
          open={editDialogOpen}
          onOpenChange={setEditDialogOpen}
          product={editingItem}
          onSaved={handleRefresh}
        />
      )}
      {editingItem && !isProducts && (
        <EditServiceDialog
          open={editDialogOpen}
          onOpenChange={setEditDialogOpen}
          service={editingItem}
          onSaved={handleRefresh}
        />
      )}
    </div>
  )
}
