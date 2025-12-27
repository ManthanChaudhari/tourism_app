import { createSupabaseServerClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function POST(request) {
  try {
    const { email } = await request.json()

    // Validate required fields
    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      )
    }

    const supabase = await createSupabaseServerClient()

    // Resend confirmation email
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email: email.trim().toLowerCase(),
    })

    if (error) {
      // Handle specific error cases
      if (error.message.includes("Email rate limit exceeded")) {
        return NextResponse.json(
          { error: "Please wait before requesting another confirmation email" },
          { status: 429 }
        )
      }

      if (error.message.includes("User not found")) {
        return NextResponse.json(
          { error: "No account found with this email address" },
          { status: 404 }
        )
      }

      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      )
    }

    return NextResponse.json(
      {
        message: "Confirmation email has been resent. Please check your inbox.",
      },
      { status: 200 }
    )
  } catch (error) {
    console.error("Resend confirmation error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}