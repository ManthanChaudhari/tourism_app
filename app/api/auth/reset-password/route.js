import { createSupabaseServerClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function POST(request) {
  try {
    const { password } = await request.json()

    // Validate required fields
    if (!password) {
      return NextResponse.json(
        { error: "Password is required" },
        { status: 400 }
      )
    }

    // Validate password strength
    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters long" },
        { status: 400 }
      )
    }

    // Additional password strength validation
    const hasUpperCase = /[A-Z]/.test(password)
    const hasLowerCase = /[a-z]/.test(password)
    const hasNumbers = /\d/.test(password)
    
    if (!hasUpperCase || !hasLowerCase || !hasNumbers) {
      return NextResponse.json(
        { error: "Password must contain at least one uppercase letter, one lowercase letter, and one number" },
        { status: 400 }
      )
    }

    const supabase = await createSupabaseServerClient()

    // Update the user's password
    const { error } = await supabase.auth.updateUser({
      password: password
    })

    if (error) {
      console.error("Password update error:", error)
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { message: "Password updated successfully" },
      { status: 200 }
    )
  } catch (error) {
    console.error("Password update error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}