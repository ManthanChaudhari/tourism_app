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
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-orange-200 to-orange-300">
        {/* Subtle Background Shapes - Only 2 shapes kept */}
        <motion.div
          className="absolute top-20 left-20 w-16 h-16 border-2 border-orange-300 rounded-full opacity-40"
          animate={{
            y: [0, -20, 0],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        
        <motion.div
          className="absolute bottom-32 right-20 w-20 h-20 bg-orange-300 rounded-full opacity-30"
          animate={{
            scale: [1, 0.8, 1],
            x: [0, -20, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 3,
          }}
        />

        {/* Animated Curved Line - Subtle background decoration */}
        <motion.svg
          className="hidden sm:block absolute top-0 right-0 w-full h-full opacity-20"
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

        {/* Travel-themed Visual Elements */}
        {/* Airplane Path */}
        <motion.svg
          className="absolute inset-0 w-full h-full opacity-5"
          viewBox="0 0 1200 800"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 15, ease: "easeInOut", delay: 2 }}
        >
          <defs>
            <path id="flightPath" d="M 100,600 Q 400,100 800,300 Q 1000,400 1100,200" />
          </defs>
          <motion.path
            d="M 100,600 Q 400,100 800,300 Q 1000,400 1100,200"
            stroke="#f97316"
            strokeWidth="3"
            fill="none"
            strokeDasharray="10,5"
            animate={{
              strokeDashoffset: [0, -100],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear",
            }}
          />
          <motion.g
            initial={{ offsetDistance: "0%" }}
            animate={{ offsetDistance: "100%" }}
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2,
            }}
            style={{ offsetPath: "path('M 100,600 Q 400,100 800,300 Q 1000,400 1100,200')" }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="#f97316">
              <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/>
            </svg>
          </motion.g>
        </motion.svg>

        {/* Mountain Silhouettes */}
        <svg className="absolute bottom-0 left-0 w-full h-full opacity-6" viewBox="0 0 1200 800">
          <path
            d="M 0,800 L 0,600 L 200,400 L 400,500 L 600,300 L 800,450 L 1000,350 L 1200,500 L 1200,800 Z"
            fill="url(#mountainGradient)"
          />
          <defs>
            <linearGradient id="mountainGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#f97316" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#f97316" stopOpacity="0.1" />
            </linearGradient>
          </defs>
        </svg>

        {/* Compass Rose */}
        <motion.svg
          className="absolute top-1/4 right-1/4 w-32 h-32 opacity-4"
          viewBox="0 0 100 100"
          animate={{ rotate: 360 }}
          transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
        >
          <circle cx="50" cy="50" r="45" fill="none" stroke="#f97316" strokeWidth="1" />
          <circle cx="50" cy="50" r="35" fill="none" stroke="#f97316" strokeWidth="0.5" />
          <path d="M50,5 L55,45 L50,50 L45,45 Z" fill="#f97316" />
          <path d="M95,50 L55,55 L50,50 L55,45 Z" fill="#f97316" />
          <path d="M50,95 L45,55 L50,50 L55,55 Z" fill="#f97316" />
          <path d="M5,50 L45,45 L50,50 L45,55 Z" fill="#f97316" />
          <text x="50" y="15" textAnchor="middle" fontSize="8" fill="#f97316" fontWeight="bold">N</text>
          <text x="85" y="55" textAnchor="middle" fontSize="6" fill="#f97316">E</text>
          <text x="50" y="90" textAnchor="middle" fontSize="6" fill="#f97316">S</text>
          <text x="15" y="55" textAnchor="middle" fontSize="6" fill="#f97316">W</text>
        </motion.svg>

        {/* World Map Dots Pattern */}
        <svg className="absolute inset-0 w-full h-full opacity-3" viewBox="0 0 1200 800">
          <defs>
            <pattern id="worldDots" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
              <circle cx="20" cy="20" r="1" fill="#f97316" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#worldDots)" />
        </svg>
      </div>

      <div className="relative z-10 min-h-screen flex flex-col lg:flex-row">
        {/* Left Side - Content (Hidden on mobile, visible on md+) */}
        <div className="hidden md:flex lg:w-1/2 xl:w-2/5 relative">
          <div className="relative z-10 flex flex-col justify-center items-start p-6 md:p-8 lg:p-12 xl:p-16 text-gray-800 w-full">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
              className="mb-6 lg:mb-8"
            >
              <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-4 lg:mb-6 leading-tight">
                <span className="text-gray-600 font-normal text-2xl md:text-3xl lg:text-4xl xl:text-5xl block mb-2">Welcome Back to</span>
                <span className="text-orange-500 text-3xl md:text-4xl lg:text-5xl xl:text-6xl">BookingAdventures</span>
              </h1>
              <p className="text-lg lg:text-xl opacity-90 max-w-lg leading-relaxed mt-6">
                Continue your journey to discover amazing destinations and create unforgettable memories with our curated travel experiences.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
              className="bg-white/10 backdrop-blur-sm rounded-xl p-4 lg:p-6 border border-white/20 max-w-lg"
            >
              <div className="flex items-center justify-center space-x-8 lg:space-x-12">
                <div className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <svg className="w-5 h-5 lg:w-6 lg:h-6 text-orange-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <div className="text-3xl lg:text-4xl font-bold text-orange-500">500+</div>
                  </div>
                  <div className="text-sm lg:text-base text-gray-700 font-medium">Destinations</div>
                </div>
                
                <div className="w-px h-12 bg-orange-300/50"></div>
                
                <div className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <svg className="w-5 h-5 lg:w-6 lg:h-6 text-orange-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                    </svg>
                    <div className="text-3xl lg:text-4xl font-bold text-orange-500">50K+</div>
                  </div>
                  <div className="text-sm lg:text-base text-gray-700 font-medium">Happy Travelers</div>
                </div>
              </div>
            </motion.div>

            {/* Additional visual element */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
              className="mt-8 lg:mt-12 flex items-center space-x-4 text-gray-600"
            >
              <div className="flex -space-x-2">
                <div className="w-8 h-8 lg:w-10 lg:h-10 bg-orange-400 rounded-full border-2 border-white"></div>
                <div className="w-8 h-8 lg:w-10 lg:h-10 bg-orange-500 rounded-full border-2 border-white"></div>
                <div className="w-8 h-8 lg:w-10 lg:h-10 bg-orange-600 rounded-full border-2 border-white"></div>
              </div>
              <p className="text-sm lg:text-base">
                <span className="font-semibold text-gray-800">Join thousands</span> of travelers who trust us
              </p>
            </motion.div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="w-full md:w-full lg:w-1/2 xl:w-3/5 relative">
          <div className="relative z-10 min-h-screen flex items-center justify-center md:justify-center lg:justify-center xl:justify-center px-4 md:px-6 lg:pl-8 lg:pr-16 xl:pl-12 xl:pr-20 py-4 md:py-6">
            <div className="w-full max-w-xs md:max-w-sm lg:max-w-md xl:max-w-lg">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
              >
                <Card className="bg-white/95 backdrop-blur-sm border border-white/30 shadow-lg shadow-black/5 rounded-xl overflow-hidden relative">
                  {/* Top accent line */}
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600"></div>
                  
                  {/* Subtle gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-orange-50/20 via-transparent to-orange-50/10 pointer-events-none"></div>
                  
                  <CardContent className="p-3 md:p-4 relative z-10">
                    {error && (
                      <div className={`mb-3 p-2 border rounded-lg ${
                        emailNotConfirmed 
                          ? 'bg-yellow-50/90 border-yellow-200' 
                          : 'bg-red-50/90 border-red-200'
                      }`}>
                        <p className={`text-xs ${
                          emailNotConfirmed 
                            ? 'text-yellow-800' 
                            : 'text-red-800'
                        }`}>
                          {error}
                        </p>
                        {emailNotConfirmed && (
                          <div className="mt-2">
                            <Link 
                              href="/confirm-email" 
                              className="inline-flex items-center text-xs font-medium text-orange-600 hover:text-orange-700 transition-colors"
                            >
                              Go to email confirmation page
                            </Link>
                          </div>
                        )}
                      </div>
                    )}

                    <div className="text-center mb-3">
                      {/* Tiny logo */}
                      <div className="flex justify-center mb-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-orange-600 rounded-lg flex items-center justify-center shadow-sm">
                          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                          </svg>
                        </div>
                      </div>
                      <h2 className="text-xl md:text-2xl font-bold text-black mb-1">Welcome Back</h2>
                      <p className="text-sm text-black/80">Sign in to your account to continue</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-3">
                      <div className="space-y-1">
                        <label htmlFor="email" className="text-sm font-medium text-black">
                          Email Address
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                            </svg>
                          </div>
                          <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full pl-10 pr-3 py-2 border border-gray-200/60 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 transition-all duration-200 bg-gray-50/30 text-sm"
                            placeholder="Enter your email"
                            required
                            disabled={loading}
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label htmlFor="password" className="text-sm font-medium text-black">
                          Password
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                          </div>
                          <input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full pl-10 pr-10 py-2 border border-gray-200/60 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 transition-all duration-200 bg-gray-50/30 text-sm"
                            placeholder="Enter your password"
                            required
                            disabled={loading}
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                          >
                            {showPassword ? (
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                              </svg>
                            ) : (
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                              </svg>
                            )}
                          </button>
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-0">
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            className="w-4 h-4 text-orange-600 bg-gray-100 border-gray-300 rounded focus:ring-orange-500 focus:ring-2"
                          />
                          <span className="ml-3 text-sm text-black/80">Remember me</span>
                        </label>
                        <Link href="/forgot-password" className="text-sm text-orange-500 hover:text-orange-600 font-medium transition-colors">
                          Forgot password?
                        </Link>
                      </div>

                      <Button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white py-2.5 rounded-lg font-semibold text-sm transition-all duration-200 shadow-md hover:shadow-lg hover:-translate-y-0.5 active:scale-[0.98] active:translate-y-0"
                      >
                        {loading ? "Signing In..." : "Sign In"}
                      </Button>

                      <div className="text-center mt-2">
                        <p className="text-sm text-black/80">
                          Don't have an account?{" "}
                          <Link href="/register" className="text-orange-500 hover:text-orange-600 font-medium transition-colors">
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