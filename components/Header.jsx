"use client"
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Home, Info, MapPin, LogOut } from "lucide-react";
import { useUser, useSupabase } from "@/lib/supabase/hooks";
import { authAPI } from "@/lib/auth";

export default function Header() {
  const router = useRouter();
  const { user, loading } = useUser();
  const supabase = useSupabase();

  const handleLogout = async () => {
    try {
      await authAPI.logout();
      router.push("/login");
    } catch (error) {
      console.error("Logout error:", error);
      // Force logout even if API call fails
      await supabase.auth.signOut();
      router.push("/login");
    }
  };
  return (
    <header className="absolute top-0 left-0 right-0 z-50 bg-transparent">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 pt-6">
          {/* Logo */}
          <div className="flex flex-shrink-0">
            <Link href="/">
              <h1 className="text-2xl font-bold text-orange-600 cursor-pointer hover:text-orange-700 transition-colors duration-300">
                BookingAdventures<span className="text-orange-600">.</span>
              </h1>
            </Link>
          </div>

          {/* Navigation Menu - Clean minimal design */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              href="/" 
              className="text-gray-900 font-medium transition-all duration-300 relative flex items-center gap-2 py-2 group"
            >
              <Home size={18} />
              Home
              <div className="absolute -bottom-1 left-0 w-full h-0.5 bg-orange-500 rounded-full transform origin-left transition-transform duration-300 ease-out"></div>
            </Link>
            <a 
              href="#" 
              className="text-gray-600 hover:text-gray-900 font-medium transition-all duration-300 relative flex items-center gap-2 py-2 group"
            >
              <Info size={18} />
              About
              <div className="absolute -bottom-1 left-0 w-full h-0.5 bg-orange-500 rounded-full transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out"></div>
            </a>
            <a 
              href="/packages" 
              className="text-gray-600 hover:text-gray-900 font-medium transition-all duration-300 relative flex items-center gap-2 py-2 group"
            >
              <MapPin size={18} />
              Packages
              <div className="absolute -bottom-1 left-0 w-full h-0.5 bg-orange-500 rounded-full transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out"></div>
            </a>
          </nav>

          {/* Auth Buttons */}
          <div className="flex items-center space-x-4">
            <Button 
              onClick={() => router.push("/admin")}
              variant="outline"
              className="cursor-pointer border-gray-300 text-gray-700 hover:bg-gray-50 px-6 py-2 rounded-full font-medium transition-all duration-200"
            >
              Admin
            </Button>
            
            {loading ? (
              <Button 
                disabled
                className="cursor-not-allowed bg-gray-300 text-gray-500 px-8 py-3 rounded-full font-medium"
              >
                Loading...
              </Button>
            ) : user ? (
              <Button 
                onClick={handleLogout}
                className="cursor-pointer bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-full font-medium transition-all duration-200 flex items-center gap-2"
              >
                <LogOut size={18} />
                Logout
              </Button>
            ) : (
              <Button 
                onClick={() => router.push("/login")}
                className="cursor-pointer bg-gray-900 hover:bg-gray-800 text-white px-8 py-3 rounded-full font-medium transition-all duration-200"
              >
                Login
              </Button>
            )}
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