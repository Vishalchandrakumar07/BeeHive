import { redirect } from "next/navigation"
import { createServerSupabase } from "@/lib/server"
import { ShopProductsClient } from "@/components/shop-products-client"

export default async function ShopProductPage({
  params,
}: {
  params: Promise<{ shopId: string; apartmentId: string }>
}) {
  const { shopId, apartmentId } = await params

  const supabase = await createServerSupabase()

  const { data: shop } = await supabase.from("shops").select("*, sellers(seller_type)").eq("id", shopId).single()

  if (!shop) {
    redirect(`/customer/${apartmentId}`)
  }

  const { data: products } = await supabase.from("products").select("*").eq("shop_id", shopId).order("name")

  const { data: services } = await supabase.from("services").select("*").eq("shop_id", shopId).order("name")

  return (
    <ShopProductsClient shop={shop} products={products ?? []} services={services ?? []} apartmentId={apartmentId} />
  )
}
