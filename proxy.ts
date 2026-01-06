import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { updateSession } from "@/lib/proxy"

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // 🚫 Do NOT run Supabase session logic For Technician system
  if (pathname.startsWith("/seller")) {
    return NextResponse.next()
  }

  // ✅ Run Supabase auth for rest of the app
  return await updateSession(request)
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}
