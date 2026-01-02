'use client'

import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="mx-auto max-w-7xl px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0">
          
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-orange-600 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </div>
            <span className="text-xl font-bold text-white">BookingAdventures</span>
          </div>

          {/* Navigation Links */}
          <div className="flex items-center space-x-8">
            <Link href="/contact" className="text-gray-300 hover:text-white transition-colors">
              Contact Us
            </Link>
            <Link href="/terms" className="text-gray-300 hover:text-white transition-colors">
              Terms & Conditions
            </Link>
            <span className="text-gray-500">|</span>
            <div className="flex items-center space-x-2 text-sm text-gray-300">
              <svg className="w-4 h-4 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <span>+1 (555) 123-4567</span>
            </div>
          </div>

          {/* Copyright */}
          <div className="text-sm text-gray-400">
            © 2024 BookingAdventures
          </div>
        </div>
      </div>
    </footer>
  );
}