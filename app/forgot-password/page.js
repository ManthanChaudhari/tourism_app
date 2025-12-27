"use client"
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { authAPI } from "@/lib/auth";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      await authAPI.forgotPassword(email);
      setMessage("Password reset email sent! Please check your inbox.");
      setEmail("");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Travel Image */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        {/* Background Image Placeholder with Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-400 via-teal-500 to-orange-400"></div>
        <div className="absolute inset-0 bg-black/20"></div>
        
        {/* Decorative Elements */}
        <div className="absolute top-20 left-20 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
        <div className="absolute bottom-32 right-16 w-24 h-24 bg-orange-300/20 rounded-full blur-lg"></div>
        <div className="absolute top-1/2 left-16 w-16 h-16 bg-blue-300/30 rounded-full blur-md"></div>
        
        {/* Content Overlay */}
        <div className="relative z-10 flex flex-col justify-center items-start p-20 text-white">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-4">
              Reset Your Password
              <br />
              <span className="text-orange-300">BookingAdventures</span>
            </h1>
            <p className="text-lg opacity-90 max-w-md">
              Don&apos;t worry! It happens to the best of us. Enter your email and we&apos;ll send you a link to reset your password.
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Forgot Password Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gradient-to-br from-orange-50/30 via-white to-blue-50/30">
        <div className="w-full max-w-md">
          {/* Logo for Mobile */}
          <div className="lg:hidden text-center mb-8">
            <h1 className="text-2xl font-bold text-orange-600">
              BookingAdventures<span className="text-orange-500">.</span>
            </h1>
          </div>

          <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-xl rounded-3xl overflow-hidden">
            <CardContent className="p-8">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Forgot Password?</h2>
                <p className="text-gray-600">Enter your email address and we&apos;ll send you a reset link</p>
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

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Email Field */}
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium text-gray-700">
                    Email Address
                  </label>
                  <div className="relative">
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 bg-gray-50/50"
                      placeholder="Enter your email"
                      required
                      disabled={loading}
                    />
                    <svg className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                    </svg>
                  </div>
                </div>

                {/* Send Reset Link Button */}
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-orange-600 hover:bg-orange-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white py-3 rounded-2xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  {loading ? "Sending..." : "Send Reset Link"}
                </Button>

                {/* Back to Login Link */}
                <div className="text-center mt-6">
                  <p className="text-gray-600">
                    Remember your password?{" "}
                    <Link href="/login" className="text-orange-600 hover:text-orange-700 font-medium transition-colors">
                      Back to Login
                    </Link>
                  </p>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}