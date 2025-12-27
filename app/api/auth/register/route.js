import { createSupabaseServerClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function POST(request) {
  try {
    const { email, password, firstName, lastName } = await request.json()

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

    // Validate name fields if provided
    if (firstName && firstName.trim().length === 0) {
      return NextResponse.json(
        { error: "First name cannot be empty" },
        { status: 400 }
      )
    }

    if (lastName && lastName.trim().length === 0) {
      return NextResponse.json(
        { error: "Last name cannot be empty" },
        { status: 400 }
      )
    }

    const supabase = await createSupabaseServerClient()

    // Register user with Supabase Auth
    const { data, error } = await supabase.auth.signUp({
      email: email.trim().toLowerCase(),
      password,
      options: {
        data: {
          first_name: firstName?.trim() || "",
          last_name: lastName?.trim() || "",
        },
      },
    })

    if (error) {
      // Handle specific error cases
      if (error.message.includes("User already registered")) {
        return NextResponse.json(
          { error: "An account with this email already exists" },
          { status: 409 }
        )
      }

      if (error.message.includes("Password should be at least")) {
        return NextResponse.json(
          { error: "Password does not meet security requirements" },
          { status: 400 }
        )
      }

      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      )
    }

    return NextResponse.json(
      {
        message: "Registration successful. Please check your email to confirm your account.",
        user: {
          id: data.user?.id,
          email: data.user?.email,
          emailConfirmed: !!data.user?.email_confirmed_at,
        },
      },
      { status: 201 }
    )
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}