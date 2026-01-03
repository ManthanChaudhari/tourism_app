"use client"
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Home, Info, MapPin, LogOut } from "lucide-react";
import { useUser, useSupabase } from "@/lib/supabase/hooks";
import { authAPI } from "@/lib/auth";

export default function Header() {
  const router = useRouter();
  const { user, loading } = useUser();
  const supabase = useSupabase();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
            <h1 className="text-2xl font-bold text-orange-600 cursor-pointer hover:text-orange-700 transition-colors duration-300">
              BookingAdventures<span className="text-orange-600">.</span>
            </h1>
          </div>

          {/* Desktop Navigation Menu - Visible on larger screens */}
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

          {/* Desktop Auth Buttons - Visible on larger screens */}
          <div className="hidden md:flex items-center space-x-4">
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

          {/* Mobile Menu Button - Only visible on small screens */}
          <div className="md:hidden relative">
            <button 
              onClick={() => {
                console.log("Menu button clicked, current state:", isMobileMenuOpen);
                setIsMobileMenuOpen(!isMobileMenuOpen);
              }}
              className="text-gray-600 hover:text-gray-900 focus:outline-none transition-colors duration-300 p-2 rounded-lg hover:bg-gray-100/50"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              {/* Debug indicator */}
              {isMobileMenuOpen && <span className="ml-2 text-xs text-red-500">OPEN</span>}
            </button>

            {/* Mobile Menu Dropdown - Centered modal style */}
            {isMobileMenuOpen && (
              <>
                {console.log("Rendering mobile menu, state:", isMobileMenuOpen)}
                {/* Backdrop */}
                <div 
                  className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm"
                  onClick={() => setIsMobileMenuOpen(false)}
                />
                
                {/* Menu Content - Top-right corner positioning with animation */}
                <div className="fixed top-8
                 right-2 z-50 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-gray-200/50 py-6 overflow-hidden transform transition-all duration-300 ease-out animate-in slide-in-from-top-2 fade-in-0 scale-in-95">
                  {/* Navigation Links */}
                  <div className="px-6 pb-4 border-b border-gray-200/50">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Navigation</h3>
                      {/* Close button aligned with NAVIGATION text */}
                      <button 
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="text-gray-600 hover:text-gray-900 transition-colors duration-200 p-1 rounded-full hover:bg-gray-100"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                    <a 
                      href="#" 
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center gap-3 px-3 py-3 text-gray-900 font-medium rounded-lg hover:bg-orange-50 hover:text-orange-600 transition-all duration-200"
                    >
                      <Home size={18} />
                      <span className="text-base">Home</span>
                    </a>
                    <a 
                      href="#" 
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center gap-3 px-3 py-3 text-gray-600 hover:text-gray-900 font-medium rounded-lg hover:bg-orange-50 hover:text-orange-600 transition-all duration-200"
                    >
                      <Info size={18} />
                      <span className="text-base">About</span>
                    </a>
                    <a 
                      href="#" 
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center gap-3 px-3 py-3 text-gray-600 hover:text-gray-900 font-medium rounded-lg hover:bg-orange-50 hover:text-orange-600 transition-all duration-200"
                    >
                      <MapPin size={18} />
                      <span className="text-base">Destination</span>
                    </a>
                  </div>

                  {/* Account Section */}
                  <div className="px-6 pt-4 space-y-3">
                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">Account</h3>
                    
                    <Button 
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        router.push("/admin");
                      }}
                      variant="outline"
                      className="w-full justify-center border-gray-300 text-gray-700 hover:bg-gray-50 px-4 py-3 rounded-lg font-medium transition-all duration-200 text-base"
                    >
                      Admin
                    </Button>
                    
                    {loading ? (
                      <Button 
                        disabled
                        className="w-full justify-center cursor-not-allowed bg-gray-300 text-gray-500 px-4 py-3 rounded-lg font-medium text-base"
                      >
                        Loading...
                      </Button>
                    ) : user ? (
                      <Button 
                        onClick={() => {
                          setIsMobileMenuOpen(false);
                          handleLogout();
                        }}
                        className="w-full justify-center cursor-pointer bg-red-600 hover:bg-red-700 text-white px-4 py-3 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 text-base"
                      >
                        <LogOut size={18} />
                        Logout
                      </Button>
                    ) : (
                      <Button 
                        onClick={() => {
                          setIsMobileMenuOpen(false);
                          router.push("/login");
                        }}
                        className="w-full justify-center cursor-pointer bg-gray-900 hover:bg-gray-800 text-white px-4 py-3 rounded-lg font-medium transition-all duration-200 text-base"
                      >
                        Login
                      </Button>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}