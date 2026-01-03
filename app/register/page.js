"use client"
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authAPI } from "@/lib/auth";
import { motion } from "framer-motion";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const router = useRouter();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validatePassword = (password) => {
    if (password.length < 6) {
      return "Password must be at least 6 characters long";
    }
    
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    
    if (!hasUpperCase || !hasLowerCase || !hasNumbers) {
      return "Password must contain at least one uppercase letter, one lowercase letter, and one number";
    }
    
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    // Validate password
    const passwordError = validatePassword(formData.password);
    if (passwordError) {
      setError(passwordError);
      setLoading(false);
      return;
    }

    // Check if passwords match
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      const result = await authAPI.register({
        email: formData.email,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName
      });
      
      setMessage(result.message);
      
      // Clear form
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: ""
      });
      setAcceptTerms(false);
      
      // Redirect to login after 3 seconds
      setTimeout(() => {
        router.push("/login");
      }, 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Background - Same as login page */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-orange-200 to-orange-300">
        {/* Subtle Background Shapes - Reduced from login page */}
        <motion.div
          className="absolute top-20 left-20 w-16 h-16 border-2 border-orange-300 rounded-full opacity-30"
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
          className="absolute bottom-32 right-20 w-20 h-20 bg-orange-300 rounded-full opacity-20"
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

        {/* Simplified Curved Line */}
        <motion.svg
          className="hidden sm:block absolute top-0 right-0 w-full h-full opacity-15"
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
                <span className="text-gray-600 font-normal text-2xl md:text-3xl lg:text-4xl xl:text-5xl block mb-2">Join</span>
                <span className="text-orange-500 text-3xl md:text-4xl lg:text-5xl xl:text-6xl">BookingAdventures</span>
              </h1>
              <p className="text-lg lg:text-xl opacity-90 max-w-lg leading-relaxed mt-6">
                Create your account and unlock exclusive deals, personalized recommendations, and seamless travel planning.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
              className="bg-white/10 backdrop-blur-sm rounded-xl p-4 lg:p-6 border border-white/20 max-w-lg"
            >
              <div className="space-y-4">
                <div className="flex items-center">
                  <svg className="w-5 h-5 lg:w-6 lg:h-6 text-orange-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-sm lg:text-base text-gray-700 font-medium">Exclusive member deals</span>
                </div>
                <div className="flex items-center">
                  <svg className="w-5 h-5 lg:w-6 lg:h-6 text-orange-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-sm lg:text-base text-gray-700 font-medium">Personalized recommendations</span>
                </div>
                <div className="flex items-center">
                  <svg className="w-5 h-5 lg:w-6 lg:h-6 text-orange-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-sm lg:text-base text-gray-700 font-medium">24/7 travel support</span>
                </div>
              </div>
            </motion.div>

            {/* Trust indicators */}
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
                <span className="font-semibold text-gray-800">Join 50K+</span> happy travelers
              </p>
            </motion.div>
          </div>
        </div>

        {/* Right Side - Registration Form */}
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
                    {message && (
                      <div className="mb-3 p-2 border rounded-lg bg-green-50/90 border-green-200">
                        <p className="text-xs text-green-800">{message}</p>
                      </div>
                    )}

                    {error && (
                      <div className="mb-3 p-2 border rounded-lg bg-red-50/90 border-red-200">
                        <p className="text-xs text-red-800">{error}</p>
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
                      <h2 className="text-xl md:text-2xl font-bold text-black mb-1">Create Account</h2>
                      <p className="text-sm text-black/80">Join us and start planning your next adventure</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-3">
                      {/* Name Fields */}
                      <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-1">
                          <label htmlFor="firstName" className="text-sm font-medium text-black">
                            First Name
                          </label>
                          <input
                            id="firstName"
                            name="firstName"
                            type="text"
                            value={formData.firstName}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-200/60 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 transition-all duration-200 bg-gray-50/30 text-sm"
                            placeholder="John"
                            required
                            disabled={loading}
                          />
                        </div>
                        <div className="space-y-1">
                          <label htmlFor="lastName" className="text-sm font-medium text-black">
                            Last Name
                          </label>
                          <input
                            id="lastName"
                            name="lastName"
                            type="text"
                            value={formData.lastName}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-200/60 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 transition-all duration-200 bg-gray-50/30 text-sm"
                            placeholder="Doe"
                            required
                            disabled={loading}
                          />
                        </div>
                      </div>

                      {/* Email Field */}
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
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            className="w-full pl-10 pr-3 py-2 border border-gray-200/60 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 transition-all duration-200 bg-gray-50/30 text-sm"
                            placeholder="Enter your email"
                            required
                            disabled={loading}
                          />
                        </div>
                      </div>

                      {/* Password Field */}
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
                            name="password"
                            type={showPassword ? "text" : "password"}
                            value={formData.password}
                            onChange={handleInputChange}
                            className="w-full pl-10 pr-10 py-2 border border-gray-200/60 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 transition-all duration-200 bg-gray-50/30 text-sm"
                            placeholder="Create a strong password"
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

                      {/* Confirm Password Field */}
                      <div className="space-y-1">
                        <label htmlFor="confirmPassword" className="text-sm font-medium text-black">
                          Confirm Password
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                          </div>
                          <input
                            id="confirmPassword"
                            name="confirmPassword"
                            type={showConfirmPassword ? "text" : "password"}
                            value={formData.confirmPassword}
                            onChange={handleInputChange}
                            className="w-full pl-10 pr-10 py-2 border border-gray-200/60 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 transition-all duration-200 bg-gray-50/30 text-sm"
                            placeholder="Confirm your password"
                            required
                            disabled={loading}
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                          >
                            {showConfirmPassword ? (
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

                      {/* Password Requirements - Compact */}
                      <div className="text-xs text-gray-600 bg-gray-50/50 p-2 rounded-lg border border-gray-200/40">
                        <p>6+ characters with uppercase, lowercase, and number</p>
                      </div>

                      {/* Terms and Conditions */}
                      <div className="flex items-start gap-2">
                        <input
                          id="acceptTerms"
                          type="checkbox"
                          checked={acceptTerms}
                          onChange={(e) => setAcceptTerms(e.target.checked)}
                          className="w-4 h-4 text-orange-600 bg-gray-100 border-gray-300 rounded focus:ring-orange-500 focus:ring-2 mt-0.5"
                          required
                          disabled={loading}
                        />
                        <label htmlFor="acceptTerms" className="text-xs text-black/80 leading-relaxed">
                          I agree to the{" "}
                          <Link href="/terms" className="text-orange-500 hover:text-orange-600 font-medium transition-colors">
                            Terms of Service
                          </Link>{" "}
                          and{" "}
                          <Link href="/privacy" className="text-orange-500 hover:text-orange-600 font-medium transition-colors">
                            Privacy Policy
                          </Link>
                        </label>
                      </div>

                      <Button
                        type="submit"
                        disabled={!acceptTerms || loading}
                        className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white py-2.5 rounded-lg font-semibold text-sm transition-all duration-200 shadow-md hover:shadow-lg hover:-translate-y-0.5 active:scale-[0.98] active:translate-y-0"
                      >
                        {loading ? "Creating Account..." : "Create Account"}
                      </Button>

                      <div className="text-center mt-2">
                        <p className="text-sm text-black/80">
                          Already have an account?{" "}
                          <Link href="/login" className="text-orange-500 hover:text-orange-600 font-medium transition-colors">
                            Sign In
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