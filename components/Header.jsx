"use client"
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Home, Info, MapPin } from "lucide-react";

export default function Header() {
  const router = useRouter();
  return (
    <header className="absolute top-0 left-0 right-0 z-50 bg-transparent">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 pt-6">
          {/* Logo */}
          <div className="flex flex-shrink-0">
            <h1 className="text-2xl font-bold text-orange-600 cursor-pointer hover:text-orange-700 transition-colors duration-300">
              BookingAdventures<span className="text-orange-600">.</span>
            </h1>
          </div>

          {/* Navigation Menu - Clean minimal design */}
          <nav className="hidden md:flex items-center space-x-8">
            <a 
              href="#" 
              className="text-gray-900 font-medium transition-all duration-300 relative flex items-center gap-2 py-2 group"
            >
              <Home size={18} />
              Home
              <div className="absolute -bottom-1 left-0 w-full h-0.5 bg-orange-500 rounded-full transform origin-left transition-transform duration-300 ease-out"></div>
            </a>
            <a 
              href="#" 
              className="text-gray-600 hover:text-gray-900 font-medium transition-all duration-300 relative flex items-center gap-2 py-2 group"
            >
              <Info size={18} />
              About
              <div className="absolute -bottom-1 left-0 w-full h-0.5 bg-orange-500 rounded-full transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out"></div>
            </a>
            <a 
              href="#" 
              className="text-gray-600 hover:text-gray-900 font-medium transition-all duration-300 relative flex items-center gap-2 py-2 group"
            >
              <MapPin size={18} />
              Destination
              <div className="absolute -bottom-1 left-0 w-full h-0.5 bg-orange-500 rounded-full transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out"></div>
            </a>
          </nav>

          {/* Login Button - Rounded button */}
          <div className="flex items-center space-x-4">
            <Button 
              onClick={() => router.push("/admin")}
              variant="outline"
              className="cursor-pointer border-gray-300 text-gray-700 hover:bg-gray-50 px-6 py-2 rounded-full font-medium transition-all duration-200"
            >
              Admin
            </Button>
            <Button 
            onClick = {() => router.push("/login")}
              className="cursor-pointer bg-gray-900 hover:bg-gray-800 text-white px-8 py-3 rounded-full font-medium transition-all duration-200"
            >
              Login
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button className="text-gray-600 hover:text-gray-900 focus:outline-none transition-colors duration-300 p-2 rounded-lg hover:bg-gray-100/50">
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