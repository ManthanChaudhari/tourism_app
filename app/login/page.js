"use client"
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authAPI } from "@/lib/auth";
import { motion } from "framer-motion";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [emailNotConfirmed, setEmailNotConfirmed] = useState(false);

  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setEmailNotConfirmed(false);

    try {
      await authAPI.login({ email, password });
      router.push("/");
    } catch (err) {
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
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-white via-orange-100 to-orange-200">
        {/* Animated Geometric Shapes - Responsive sizes */}
        <motion.div
          className="absolute top-10 sm:top-20 left-10 sm:left-20 w-8 sm:w-12 lg:w-16 h-8 sm:h-12 lg:h-16 border-2 border-orange-300 rounded-full"
          animate={{
            y: [0, -20, 0],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        
        <motion.div
          className="absolute top-16 sm:top-32 right-20 sm:right-40 w-4 sm:w-6 lg:w-8 h-4 sm:h-6 lg:h-8 bg-orange-400 rounded-full"
          animate={{
            x: [0, 30, 0],
            y: [0, -15, 0],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
        />
        
        <motion.div
          className="absolute bottom-20 sm:bottom-40 left-16 sm:left-32 w-6 sm:w-8 lg:w-12 h-6 sm:h-8 lg:h-12 border-2 border-orange-400 rounded-full"
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, -180, -360],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
        />
        
        <motion.div
          className="absolute top-1/2 left-1/4 w-3 sm:w-4 lg:w-6 h-3 sm:h-4 lg:h-6 bg-orange-500"
          style={{ clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' }}
          animate={{
            y: [0, -25, 0],
            rotate: [0, 120, 240, 360],
          }}
          transition={{
            duration: 7,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.5,
          }}
        />
        
        <motion.div
          className="absolute bottom-16 sm:bottom-32 right-10 sm:right-20 w-10 sm:w-16 lg:w-20 h-10 sm:h-16 lg:h-20 bg-orange-300 rounded-full opacity-60"
          animate={{
            scale: [1, 0.8, 1],
            x: [0, -20, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 3,
          }}
        />
        
        <motion.div
          className="absolute top-1/3 right-1/3 w-5 sm:w-7 lg:w-10 h-5 sm:h-7 lg:h-10 border-2 border-orange-500 rounded-full"
          animate={{
            rotate: [0, 360],
            scale: [1, 1.3, 1],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1.5,
          }}
        />
        
        {/* Animated Curved Lines - Hidden on small screens */}
        <motion.svg
          className="hidden sm:block absolute top-0 right-0 w-full h-full opacity-30"
          viewBox="0 0 1200 800"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 3, ease: "easeInOut" }}
        >
          <motion.path
            d="M 0,400 Q 300,200 600,400 T 1200,400"
            stroke="#fb923c"
            strokeWidth="2"
            fill="none"
            animate={{
              d: [
                "M 0,400 Q 300,200 600,400 T 1200,400",
                "M 0,350 Q 300,150 600,350 T 1200,350",
                "M 0,400 Q 300,200 600,400 T 1200,400",
              ],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </motion.svg>
        
        <motion.svg
          className="hidden sm:block absolute bottom-0 left-0 w-full h-full opacity-20"
          viewBox="0 0 1200 800"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 4, ease: "easeInOut", delay: 1 }}
        >
          <motion.path
            d="M 0,600 Q 400,400 800,600 T 1200,600"
            stroke="#f97316"
            strokeWidth="3"
            fill="none"
            animate={{
              d: [
                "M 0,600 Q 400,400 800,600 T 1200,600",
                "M 0,650 Q 400,450 800,650 T 1200,650",
                "M 0,600 Q 400,400 800,600 T 1200,600",
              ],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2,
            }}
          />
        </motion.svg>
      </div>

      <div className="relative z-10 min-h-screen flex flex-col lg:flex-row">
        {/* Left Side - Content (Hidden on mobile, visible on md+) */}
        <div className="hidden md:flex lg:w-1/2 xl:w-2/5 relative">
          <div className="relative z-10 flex flex-col justify-center items-start p-6 md:p-8 lg:p-12 xl:p-16 text-gray-800">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
              className="mb-6 lg:mb-8"
            >
              <h1 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold mb-3 lg:mb-4 leading-tight">
                Welcome Back to<br />
                <span className="text-orange-500">BookingAdventures</span>
              </h1>
              <p className="text-base lg:text-lg opacity-90 max-w-md leading-relaxed">
                Continue your journey to discover amazing destinations and create unforgettable memories.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
              className="grid grid-cols-2 gap-4 lg:gap-8 mt-6 lg:mt-8"
            >
              <div className="text-center">
                <div className="text-2xl lg:text-3xl font-bold text-orange-500">500+</div>
                <div className="text-xs lg:text-sm opacity-80">Destinations</div>
              </div>
              <div className="text-center">
                <div className="text-2xl lg:text-3xl font-bold text-orange-500">50K+</div>
                <div className="text-xs lg:text-sm opacity-80">Happy Travelers</div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="w-full md:w-full lg:w-1/2 xl:w-3/5 relative">
          <div className="relative z-10 min-h-screen flex items-center justify-center md:justify-center lg:justify-center xl:justify-center px-4 md:px-6 lg:pl-8 lg:pr-16 xl:pl-12 xl:pr-20 py-8 md:py-12">
            <div className="w-full max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
              >
                <Card className="bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl rounded-2xl lg:rounded-3xl overflow-hidden">
                  <CardContent className="p-6 md:p-8 lg:p-10">
                    {error && (
                      <div className={`mb-4 lg:mb-6 p-3 lg:p-4 border rounded-xl lg:rounded-2xl ${
                        emailNotConfirmed 
                          ? 'bg-yellow-50/90 border-yellow-200' 
                          : 'bg-red-50/90 border-red-200'
                      }`}>
                        <p className={`text-xs lg:text-sm ${
                          emailNotConfirmed 
                            ? 'text-yellow-800' 
                            : 'text-red-800'
                        }`}>
                          {error}
                        </p>
                        {emailNotConfirmed && (
                          <div className="mt-2 lg:mt-3">
                            <Link 
                              href="/confirm-email" 
                              className="inline-flex items-center text-xs lg:text-sm font-medium text-orange-600 hover:text-orange-700 transition-colors"
                            >
                              Go to email confirmation page
                              <svg className="ml-1 w-3 h-3 lg:w-4 lg:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                              </svg>
                            </Link>
                          </div>
                        )}
                      </div>
                    )}

                    <div className="text-center mb-6 lg:mb-8">
                      <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-black mb-2">Welcome Back</h2>
                      <p className="text-sm lg:text-base text-black/80">Sign in to your account to continue</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4 lg:space-y-6">
                      <div className="space-y-1 lg:space-y-2">
                        <label htmlFor="email" className="text-xs lg:text-sm font-medium text-black">
                          Email Address
                        </label>
                        <input
                          id="email"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full px-3 lg:px-4 py-2 lg:py-3 border border-gray-200 rounded-xl lg:rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 bg-gray-50/50 text-sm lg:text-base"
                          placeholder="Enter your email"
                          required
                          disabled={loading}
                        />
                      </div>

                      <div className="space-y-1 lg:space-y-2">
                        <label htmlFor="password" className="text-xs lg:text-sm font-medium text-black">
                          Password
                        </label>
                        <div className="relative">
                          <input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-3 lg:px-4 py-2 lg:py-3 border border-gray-200 rounded-xl lg:rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 bg-gray-50/50 text-sm lg:text-base"
                            placeholder="Enter your password"
                            required
                            disabled={loading}
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 lg:right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                          >
                            {showPassword ? (
                              <svg className="w-4 h-4 lg:w-5 lg:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                              </svg>
                            ) : (
                              <svg className="w-4 h-4 lg:w-5 lg:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                              </svg>
                            )}
                          </button>
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0">
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            className="w-3 h-3 lg:w-4 lg:h-4 text-orange-600 bg-gray-100 border-gray-300 rounded focus:ring-orange-500 focus:ring-2"
                          />
                          <span className="ml-2 text-xs lg:text-sm text-black/80">Remember me</span>
                        </label>
                        <Link href="/forgot-password" className="text-xs lg:text-sm text-orange-400 hover:text-orange-300 font-medium transition-colors">
                          Forgot password?
                        </Link>
                      </div>

                      <Button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white py-2.5 lg:py-3 rounded-xl lg:rounded-2xl font-semibold text-sm lg:text-lg transition-all duration-200 shadow-lg hover:shadow-xl"
                      >
                        {loading ? "Signing In..." : "Sign In"}
                      </Button>

                      <div className="text-center mt-4 lg:mt-6">
                        <p className="text-xs lg:text-sm text-black/80">
                          Don't have an account?{" "}
                          <Link href="/register" className="text-orange-400 hover:text-orange-300 font-medium transition-colors">
                            Sign Up
                          </Link>
                        </p>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}