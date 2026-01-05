'use client'

import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="mx-auto max-w-7xl px-4 md:px-6 lg:px-8 py-4 md:py-8">
        <div className="flex flex-col md:flex-row justify-center md:justify-between items-center space-y-3 md:space-y-0">
          
          {/* Logo */}
          <div className="flex items-center space-x-2 md:space-x-3 order-1 md:order-1">
            <div className="w-6 h-6 md:w-8 md:h-8 bg-orange-600 rounded-lg flex items-center justify-center">
              <svg className="w-3 h-3 md:w-5 md:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </div>
            <span className="text-sm md:text-xl font-bold text-white whitespace-nowrap">BookingAdventures</span>
          </div>

          {/* Navigation Links */}
          <div className="flex items-center justify-center space-x-2 md:space-x-8 order-2 md:order-2">
            <Link href="/contact" className="text-xs md:text-base text-gray-300 hover:text-white transition-colors whitespace-nowrap">
              Contact Us
            </Link>
            <Link href="/terms" className="text-xs md:text-base text-gray-300 hover:text-white transition-colors whitespace-nowrap">
              Terms & Conditions
            </Link>
            <span className="text-gray-500 text-xs md:text-base">|</span>
            <div className="flex items-center space-x-1 md:space-x-2 text-xs md:text-sm text-gray-300 whitespace-nowrap">
              <svg className="w-3 h-3 md:w-4 md:h-4 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <span>+1 (555) 123-4567</span>
            </div>
          </div>

          {/* Copyright */}
          <div className="text-xs md:text-sm text-gray-400 order-3 md:order-3">
            © 2024 BookingAdventures
          </div>
        </div>
      </div>
    </footer>
  );
}