import { createSupabaseServerClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function POST(request) {
  try {
    const { email, password } = await request.json()

    // Validate required fields
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
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

    // Validate password is not empty or just whitespace
    if (password.trim().length === 0) {
      return NextResponse.json(
        { error: "Password cannot be empty" },
        { status: 400 }
      )
    }

    const supabase = await createSupabaseServerClient()

    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password,
    })

    console.log({error})

    if (error) {
      // Handle specific error cases
      if (error.code === 'email_not_confirmed') {
        return NextResponse.json(
          { 
            error: "Please confirm your email address before logging in. Check your inbox for a confirmation email.",
            code: "email_not_confirmed"
          },
          { status: 401 }
        )
      }
      
      if (error.message.includes("Invalid login credentials")) {
        return NextResponse.json(
          { error: "Invalid email or password" },
          { status: 401 }
        )
      }

      return NextResponse.json(
        { error: "Login failed. Please check your credentials." },
        { status: 401 }
      )
    }

    console.log(data.user)
    // Check if user email is confirmed
    if (!data.user?.email_confirmed_at) {
      return NextResponse.json(
        { error: "Please confirm your email address before logging in" },
        { status: 401 }
      )
    }

    return NextResponse.json(
      {
        message: "Login successful",
        user: {
          id: data.user?.id,
          email: data.user?.email,
          firstName: data.user?.user_metadata?.first_name,
          lastName: data.user?.user_metadata?.last_name,
          emailConfirmed: !!data.user?.email_confirmed_at,
        },
      },
      { status: 200 }
    )
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}