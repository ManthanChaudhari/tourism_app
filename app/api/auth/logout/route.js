import { createSupabaseServerClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function POST(request) {
  try {
    const supabase = await createSupabaseServerClient()

    // Sign out the user
    const { error } = await supabase.auth.signOut()

    if (error) {
      console.error("Logout error:", error)
      return NextResponse.json(
        { error: "Failed to logout" },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { message: "Logout successful" },
      { status: 200 }
    )
  } catch (error) {
    console.error("Logout error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}