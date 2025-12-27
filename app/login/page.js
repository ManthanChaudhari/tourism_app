"use client"
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authAPI } from "@/lib/auth";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [emailNotConfirmed, setEmailNotConfirmed] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setEmailNotConfirmed(false);

    try {
      const result = await authAPI.login({ email, password });
      
      // Redirect to home page or dashboard on successful login
      router.push("/");
    } catch (err) {
      // Check if it's an email confirmation error
      if (err.message.includes("confirm your email") || err.code === "email_not_confirmed") {
        setEmailNotConfirmed(true);
        setError("Please confirm your email address before logging in. Check your inbox for a confirmation email.");
      } else {
        setError(err.message);
      }
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
              Welcome Back to
              <br />
              <span className="text-orange-300">BookingAdventures</span>
            </h1>
            <p className="text-lg opacity-90 max-w-md">
              Continue your journey to discover amazing destinations and create unforgettable memories.
            </p>
          </div>
          
          {/* Travel Stats */}
          <div className="grid grid-cols-2 gap-8 mt-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-300">500+</div>
              <div className="text-sm opacity-80">Destinations</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-300">50K+</div>
              <div className="text-sm opacity-80">Happy Travelers</div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
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
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h2>
                <p className="text-gray-600">Sign in to your account to continue</p>
              </div>

              {error && (
                <div className={`mb-6 p-4 border rounded-2xl ${
                  emailNotConfirmed 
                    ? 'bg-yellow-50 border-yellow-200' 
                    : 'bg-red-50 border-red-200'
                }`}>
                  <p className={`text-sm ${
                    emailNotConfirmed 
                      ? 'text-yellow-800' 
                      : 'text-red-800'
                  }`}>
                    {error}
                  </p>
                  {emailNotConfirmed && (
                    <div className="mt-3">
                      <Link 
                        href="/confirm-email" 
                        className="inline-flex items-center text-sm font-medium text-orange-600 hover:text-orange-700 transition-colors"
                      >
                        Go to email confirmation page
                        <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </Link>
                    </div>
                  )}
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

                {/* Password Field */}
                <div className="space-y-2">
                  <label htmlFor="password" className="text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 bg-gray-50/50"
                      placeholder="Enter your password"
                      required
                      disabled={loading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showPassword ? (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                {/* Remember Me & Forgot Password */}
                <div className="flex items-center justify-between">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-4 h-4 text-orange-600 bg-gray-100 border-gray-300 rounded focus:ring-orange-500 focus:ring-2"
                    />
                    <span className="ml-2 text-sm text-gray-600">Remember me</span>
                  </label>
                  <Link href="/forgot-password" className="text-sm text-orange-600 hover:text-orange-700 font-medium transition-colors">
                    Forgot password?
                  </Link>
                </div>

                {/* Login Button */}
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-orange-600 hover:bg-orange-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white py-3 rounded-2xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  {loading ? "Signing In..." : "Sign In"}
                </Button>

                {/* Sign Up Link */}
                <div className="text-center mt-6">
                  <p className="text-gray-600">
                    Don&apos;t have an account?{" "}
                    <Link href="/register" className="text-orange-600 hover:text-orange-700 font-medium transition-colors">
                      Sign up here
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