"use client"
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function Header() {
  const router = useRouter();
  return (
    <header className="absolute top-0 left-0 right-0 z-50 bg-transparent">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 pt-6">
          {/* Logo */}
          <div className="flex-shrink-0">
            <h1 className="text-2xl font-bold text-red-500">
              BookingAdventures<span className="text-red-500">.</span>
            </h1>
          </div>

          {/* Navigation Menu - Subtle white background that blends with hero */}
          <nav className="hidden md:flex items-center">
            <div className="bg-white/70 backdrop-blur-md rounded-full px-8 py-3 border-0 shadow-none">
              <div className="flex items-center space-x-8">
                <a 
                  href="#" 
                  className="text-gray-900 font-medium transition-colors duration-200 relative"
                >
                  Home
                  <div className="absolute -bottom-2 left-0 w-full h-0.5 bg-orange-500 rounded-full"></div>
                </a>
                <a 
                  href="#" 
                  className="text-gray-600 hover:text-gray-900 font-medium transition-colors duration-200"
                >
                  About
                </a>
                <a 
                  href="#" 
                  className="text-gray-600 hover:text-gray-900 font-medium transition-colors duration-200"
                >
                  Destination
                </a>
                <a 
                  href="#" 
                  className="text-gray-600 hover:text-gray-900 font-medium transition-colors duration-200"
                >
                  Tours
                </a>
              </div>
            </div>
          </nav>

          {/* Login Button - Rounded button */}
          <div className="flex items-center">
            <Button 
            onClick = {() => router.push("/login")}
              className="cursor-pointer bg-gray-900 hover:bg-gray-800 text-white px-8 py-3 rounded-full font-medium transition-all duration-200"
            >
              Login
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button className="text-gray-600 hover:text-gray-900 focus:outline-none">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}