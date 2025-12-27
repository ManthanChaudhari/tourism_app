"use client"
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { useAuth } from "@/lib/supabase/hooks";
import { useRouter } from "next/navigation";

export default function ConfirmEmailPage() {
  const [resending, setResending] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const { user, signOut } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // If user is already confirmed, redirect to home
    if (user?.email_confirmed_at) {
      router.push('/');
    }
    // Set email from user if available
    if (user?.email) {
      setEmail(user.email);
    }
  }, [user, router]);

  const handleResendConfirmation = async () => {
    if (!email) {
      setError("Please enter your email address");
      return;
    }

    setResending(true);
    setError("");
    setMessage("");

    try {
      const response = await fetch('/api/auth/resend-confirmation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to resend confirmation email');
      }

      setMessage(data.message);
    } catch (err) {
      setError(err.message || "Failed to resend confirmation email. Please try again.");
    } finally {
      setResending(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-8 bg-gradient-to-br from-orange-50/30 via-white to-blue-50/30">
      <div className="w-full max-w-md">
        <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-xl rounded-3xl overflow-hidden">
          <CardContent className="p-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                {user ? "Check Your Email" : "Resend Confirmation Email"}
              </h2>
              <p className="text-gray-600">
                {user ? (
                  <>
                    We&apos;ve sent a confirmation link to{" "}
                    <span className="font-medium text-gray-900">{user.email}</span>
                  </>
                ) : (
                  "Enter your email address to receive a new confirmation link"
                )}
              </p>
            </div>

            {message && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-2xl">
                <p className="text-green-800 text-sm">{message}</p>
              </div>
            )}

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl">
                <p className="text-red-800 text-sm">{error}</p>
              </div>
            )}

            <div className="space-y-4">
              {!user && (
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium text-gray-700">
                    Email Address
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 bg-gray-50/50"
                    placeholder="Enter your email address"
                    required
                  />
                </div>
              )}

              <div className="text-sm text-gray-600 bg-gray-50 p-4 rounded-xl">
                <p className="font-medium mb-2">Next steps:</p>
                <ol className="space-y-1 list-decimal list-inside">
                  <li>Check your email inbox</li>
                  <li>Click the confirmation link</li>
                  <li>Return to complete your login</li>
                </ol>
              </div>

              <Button
                onClick={handleResendConfirmation}
                disabled={resending || (!user && !email)}
                variant="outline"
                className="w-full py-3 rounded-2xl border-gray-200 hover:bg-gray-50 transition-all duration-200"
              >
                {resending ? "Sending..." : "Resend Confirmation Email"}
              </Button>

              <div className="text-center space-y-2">
                {user && (
                  <p className="text-sm text-gray-600">
                    Wrong email address?{" "}
                    <button
                      onClick={handleSignOut}
                      className="text-orange-600 hover:text-orange-700 font-medium transition-colors"
                    >
                      Sign out and try again
                    </button>
                  </p>
                )}
                
                <p className="text-sm text-gray-600">
                  <Link href="/login" className="text-orange-600 hover:text-orange-700 font-medium transition-colors">
                    Back to Login
                  </Link>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}